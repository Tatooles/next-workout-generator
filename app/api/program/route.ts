export const runtime = "edge";

import {
  fetchOpenRouterCompletion,
  GenerationError,
  parseStructuredJson,
  resolveRequestedModel,
} from "@/lib/ai-generation";
import { buildProgramPrompt } from "@/lib/program-prompt";
import { WorkoutRequestSchema } from "@/lib/workout-options";
import { createProgramDataSchema } from "@/lib/workout-types";

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

  if (!body.programSplit) {
    return new Response(
      JSON.stringify({ error: "programSplit: Program split is required." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const prompt = buildProgramPrompt(body);

  try {
    const requestedModel = resolveRequestedModel(body.model);
    const content = await fetchOpenRouterCompletion(
      prompt,
      requestedModel,
      "Workout Generator",
    );
    const parsedProgram = parseStructuredJson(
      content,
      createProgramDataSchema(body.programTrainingDaysPerWeek),
    );

    if (!parsedProgram.success) {
      console.error("Failed to parse program JSON:", parsedProgram.error);
      console.log("Raw response:", content);
      return new Response(
        JSON.stringify({
          error: "Failed to parse program data. Please try again.",
          rawResponse: content,
          parseError: parsedProgram.error,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ program: parsedProgram.data }), {
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

    console.log("An error ocurred!", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate program" }),
      { status: 500 },
    );
  }
}
