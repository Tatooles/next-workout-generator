export const runtime = "edge";

import {
  fetchOpenRouterCompletion,
  GenerationError,
  parseStructuredJson,
  resolveRequestedModel,
} from "@/lib/ai-generation";
import { buildWorkoutPrompt } from "@/lib/workout-prompt";
import { GenerationRequestSchema } from "@/lib/workout-options";
import { WorkoutDataSchema } from "@/lib/workout-types";

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

  const parsedRequest = GenerationRequestSchema.safeParse(requestBody);

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

  try {
    const requestedModel = resolveRequestedModel(body.model);
    const content = await fetchOpenRouterCompletion(
      prompt,
      requestedModel,
      "Workout Generator",
    );
    const parsedWorkout = parseStructuredJson(content, WorkoutDataSchema);

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
    if (error instanceof GenerationError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("An error occurred!", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate workout" }),
      { status: 500 },
    );
  }
}
