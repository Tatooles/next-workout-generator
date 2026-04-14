import type { WorkoutRequest } from "@/lib/workout-options";

export function buildWorkoutPrompt(userInformation: WorkoutRequest) {
  const promptParts: string[] = [];

  if (userInformation.workoutType) {
    promptParts.push(
      `Generate a ${userInformation.workoutType.toLowerCase()} for me.`,
    );
  } else if (userInformation.bodyParts.length > 0) {
    promptParts.push("Generate a workout for me.");
  } else {
    promptParts.push("Generate a balanced workout for me.");
  }

  if (userInformation.bodyParts.length > 0) {
    promptParts.push(
      `Prioritize these body parts: ${userInformation.bodyParts.join(", ")}.`,
    );
  }

  if (userInformation.experienceLevel) {
    promptParts.push(
      `The user is at a ${userInformation.experienceLevel.toLowerCase()} experience level. Match exercise selection, movement complexity, and total training demand appropriately.`,
    );
  }

  if (userInformation.desiredDuration) {
    promptParts.push(
      `Target a total workout duration of ${userInformation.desiredDuration}. Keep the session length as close to that target as possible while still being realistic, and return the actual best estimatedDuration in the response.`,
    );
  }

  if (userInformation.gymProfile) {
    promptParts.push(
      `Available gym setup: ${userInformation.gymProfile.toLowerCase()}.`,
    );
  }

  if (userInformation.availableEquipment.length > 0) {
    promptParts.push(
      `Additional equipment available: ${userInformation.availableEquipment.join(", ")}.`,
    );
  }

  if (
    userInformation.gymProfile ||
    userInformation.availableEquipment.length > 0
  ) {
    promptParts.push(
      "Only include exercises that can be performed with the available setup, listed equipment, or bodyweight.",
    );
  }

  if (userInformation.additionalDetails) {
    promptParts.push(
      `Additional details: ${userInformation.additionalDetails}.`,
    );
  }

  promptParts.push(`

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
- "exercises": Array of exercise objects (required, minimum 4 exercises)
- "name": Full name of the exercise (required)
- "sets": Number of sets as an integer (required)
- "reps": Rep range as a string, can be "8-10", "12-15", "AMRAP", "30 seconds", etc. (required)
- "restTime": Rest period as a string, e.g., "60s", "90s", "2 minutes" (required)
- "muscleGroups": Array of primary muscle groups targeted (required, at least 1)
- "formTips": Array of 2-3 specific form cues or tips (required)
- "estimatedDuration": Total estimated workout duration including warm-up (required)
- "notes": Any general notes about the workout, tips, or modifications (optional)

Remember: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`);

  return promptParts.join(" ");
}
