export const runtime = "edge";

import { buildWorkoutPrompt } from "@/lib/workout-prompt";
import { WorkoutRequestSchema } from "@/lib/workout-options";
import type { WorkoutData } from "@/lib/workout-types";
import { WorkoutDataSchema } from "@/lib/workout-types";

// Allowlist of permitted AI models
const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "moonshotai/kimi-k2.5",
  "openai/gpt-5-mini",
  "anthropic/claude-3.5-haiku",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsedRequest = WorkoutRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return new Response(
      JSON.stringify({
        error: parsedRequest.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const body = parsedRequest.data;
  const prompt = buildWorkoutPrompt(body);

  // Validate model against allowlist
  const requestedModel = body.model || DEFAULT_MODEL;
  if (
    !ALLOWED_MODELS.includes(requestedModel as (typeof ALLOWED_MODELS)[number])
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid model specified. Please select a valid model.",
      }),
      { status: 400 },
    );
  }

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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
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
      console.error("OpenRouter API Error:", response.status);
      return new Response("OpenRouter API error", {
        status: response.status || 500,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse and validate the JSON response
    const parsedWorkout = parseWorkoutJSON(content);

    if (!parsedWorkout.success) {
      console.error("Failed to parse workout JSON:", parsedWorkout.error);
      console.log("Raw response:", content);
      return new Response(
        JSON.stringify({
          error: "Failed to parse workout data. Please try again.",
          rawResponse: content,
          parseError: parsedWorkout.error,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ workout: parsedWorkout.data }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("An error ocurred!", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate workout" }),
      { status: 500 },
    );
  }
}

function parseWorkoutJSON(
  content: string,
): { success: true; data: WorkoutData } | { success: false; error: string } {
  try {
    // Remove markdown code blocks if present
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
