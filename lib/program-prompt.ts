import type { WorkoutRequest } from "@/lib/workout-options";

export function buildProgramPrompt(userInformation: WorkoutRequest) {
  const selectedDaysPerWeek = userInformation.programTrainingDaysPerWeek;
  const promptParts: string[] = ["Generate a workout program for me."];

  if (userInformation.programSplit) {
    promptParts.push(
      `Use a ${userInformation.programSplit.toLowerCase()} structure as the primary weekly split template.`,
    );
  } else {
    promptParts.push(
      "Choose a balanced weekly structure that fits the user's goals and recovery needs.",
    );
  }

  if (selectedDaysPerWeek) {
    promptParts.push(
      `Return exactly ${selectedDaysPerWeek} workout days for the week.`,
    );
  } else {
    promptParts.push(
      "Choose a sensible training frequency and return between 2 and 6 workout days for the week.",
    );
  }

  promptParts.push(
    "Use real weekday names for each workout day, choose sensible weekdays based on split, recovery, and goals, and return them in chronological order.",
  );
  promptParts.push(
    "Do not include rest days or recovery-only days in the JSON response.",
  );
  promptParts.push(
    "If the selected split and training frequency are an awkward match, adapt the split intelligently while keeping the overall intent.",
  );

  if (userInformation.bodyParts.length > 0) {
    promptParts.push(
      `Distribute extra weekly emphasis across these body parts: ${userInformation.bodyParts.join(", ")}.`,
    );
  }

  if (userInformation.experienceLevel) {
    promptParts.push(
      `The user is at a ${userInformation.experienceLevel.toLowerCase()} experience level. Match weekly volume, movement complexity, and recovery demand appropriately.`,
    );
  }

  if (userInformation.desiredDuration) {
    promptParts.push(
      `Target each workout day to last about ${userInformation.desiredDuration}. Keep each workout close to that target while still being realistic.`,
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
  "weeklyOverview": "Optional one-paragraph overview of the week's structure",
  "weeklyNotes": "Optional weekly guidance, recovery advice, or progression notes",
  "days": [
    {
      "day": "Monday",
      "title": "Push Day",
      "focus": "Chest, shoulders, triceps",
      "estimatedDuration": "45 minutes",
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
      "notes": "Optional notes for this day"
    }
  ]
}

Requirements:
- Return ${
    selectedDaysPerWeek
      ? `exactly ${selectedDaysPerWeek} workout entries in "days"`
      : 'between 2 and 6 workout entries in "days"'
  }
- Every entry in "days" must be a workout day
- Every "day" value must be a real weekday name
- Order the "days" entries chronologically within the week
- Do not include rest days or recovery-only days
- Every workout day must include:
  - "title" (required)
  - "estimatedDuration" (required)
  - "exercises" with 4-8 exercises (required)
- "focus" is optional for any day
- "notes" is optional for any day
- "weeklyOverview" is optional
- "weeklyNotes" is optional

Remember: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`);

  return promptParts.join(" ");
}
