export const runtime = "edge";

import type { WorkoutData } from "@/lib/workout-types";

// Allowlist of permitted AI models
const ALLOWED_MODELS = [
  "google/gemini-3-flash-preview",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "deepseek/deepseek-chat",
  "anthropic/claude-3.5-haiku",
] as const;

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

interface UserInformation {
  bodyParts: string[];
  workoutType?: string | null;
  additionalDetails?: string | null;
  model?: string | null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = constructPrompt(body);

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

function constructPrompt(userInformation: UserInformation) {
  console.log("Information from user:", userInformation);
  let prompt = "";

  // Build the workout request
  if (userInformation.workoutType) {
    prompt = `Generate a ${userInformation.workoutType} for me `;
    if (userInformation.bodyParts.length) {
      prompt += `with these additional body parts:`;
      for (const part of userInformation.bodyParts) {
        prompt += ` ${part}`;
      }
    }
  } else {
    if (userInformation.bodyParts.length) {
      prompt = "Generate a workout for me to hit these body parts:";
      for (const part of userInformation.bodyParts) {
        prompt += ` ${part}`;
      }
    }
  }
  if (userInformation.additionalDetails) {
    prompt += ` Here are some additional details: ${userInformation.additionalDetails}`;
  }

  // Specify strict JSON format
  prompt += `

IMPORTANT: You MUST respond with ONLY valid JSON in the exact format specified below. Do not include any markdown code blocks, explanations, or additional text. Return only the raw JSON object.

Required JSON structure:
{
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": "8-10",
      "restTime": "60s",
      "muscleGroups": ["Chest", "Triceps"],
      "formTips": [
        "Keep your core engaged throughout the movement",
        "Control the weight on the way down"
      ]
    }
  ],
  "estimatedDuration": "45-60 minutes",
  "notes": "Optional general notes about the workout"
}

Requirements:
- "exercises": Array of exercise objects (required, minimum 4-8 exercises)
- "name": Full name of the exercise (required)
- "sets": Number of sets as an integer (required)
- "reps": Rep range as a string, can be "8-10", "12-15", "AMRAP", "30 seconds", etc. (required)
- "restTime": Rest period as a string, e.g., "60s", "90s", "2 minutes" (required)
- "muscleGroups": Array of primary muscle groups targeted (required, at least 1)
- "formTips": Array of 2-3 specific form cues or tips (required)
- "estimatedDuration": Total estimated workout duration including warm-up (required)
- "notes": Any general notes about the workout, tips, or modifications (optional)

Remember: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

  return prompt;
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

    // Basic validation
    if (!Array.isArray(parsed.exercises) || parsed.exercises.length === 0) {
      return { success: false, error: "Invalid or empty exercises array" };
    }

    if (!parsed.estimatedDuration) {
      return { success: false, error: "Missing estimatedDuration" };
    }

    // Validate each exercise has required fields
    const requiredFields = [
      "name",
      "sets",
      "reps",
      "restTime",
      "muscleGroups",
      "formTips",
    ];
    for (const exercise of parsed.exercises) {
      for (const field of requiredFields) {
        if (!exercise[field]) {
          return {
            success: false,
            error: `Exercise missing required field: ${field}`,
          };
        }
      }
    }

    return { success: true, data: parsed as WorkoutData };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof SyntaxError ? "Invalid JSON format" : "Parsing error",
    };
  }
}
