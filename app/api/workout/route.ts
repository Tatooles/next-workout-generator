export const runtime = "edge";

import { DEFAULT_AI_MODEL } from "@/lib/ai-models";
import { buildWorkoutPrompt } from "@/lib/workout-prompt";
import { WorkoutRequestSchema } from "@/lib/workout-options";
import type { WorkoutData } from "@/lib/workout-types";
import { WorkoutDataSchema } from "@/lib/workout-types";
import { z } from "zod";

const OpenRouterChatCompletionSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    }),
  ),
});

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedRequest = WorkoutRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: parsedRequest.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
      },
      { status: 400 },
    );
  }

  const body = parsedRequest.data;
  const prompt = buildWorkoutPrompt(body);
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Server misconfiguration: missing OpenRouter API key." },
      { status: 500 },
    );
  }

  const requestedModel = body.model ?? DEFAULT_AI_MODEL;

  try {
    const payload = {
      model: requestedModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      stream: false,
    };

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000",
          "X-Title": "Workout Generator",
        },
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", response.status, errorText);
      return Response.json(
        { error: errorText || "OpenRouter API error" },
        { status: response.status || 500 },
      );
    }

    const completion = OpenRouterChatCompletionSchema.safeParse(
      await response.json(),
    );

    if (!completion.success) {
      console.error("Unexpected OpenRouter response:", completion.error);
      return Response.json(
        { error: "OpenRouter API error" },
        { status: 500 },
      );
    }

    const content = completion.data.choices[0]?.message?.content ?? "";

    if (content.trim().length === 0) {
      return Response.json(
        { error: "OpenRouter response was missing workout content." },
        { status: 502 },
      );
    }

    const parsedWorkout = parseWorkoutJSON(content);

    if (!parsedWorkout.success) {
      console.error("Failed to parse workout JSON:", parsedWorkout.error);
      console.log("Raw response:", content);
      return Response.json(
        {
          error: "Failed to parse workout data. Please try again.",
          rawResponse: content,
          parseError: parsedWorkout.error,
        },
        {
          status: 422,
        },
      );
    }

    return Response.json({ workout: parsedWorkout.data });
  } catch (error) {
    console.error("An error occurred while generating workout:", error);
    return Response.json(
      { error: "Failed to generate workout" },
      { status: 500 },
    );
  }
}

function parseWorkoutJSON(
  content: string,
): { success: true; data: WorkoutData } | { success: false; error: string } {
  try {
    let jsonStr = content.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    const result = WorkoutDataSchema.safeParse(parsed);

    if (!result.success) {
      return {
        success: false,
        error: result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", "),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof SyntaxError ? "Invalid JSON format" : "Parsing error",
    };
  }
}
