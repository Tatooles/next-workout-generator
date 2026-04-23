import type { WorkoutRequest } from "@/lib/workout-options";

export function buildProgramPrompt(userInformation: WorkoutRequest) {
  const selectedDaysPerWeek = userInformation.programTrainingDaysPerWeek;
  const parts: string[] = ["Generate a workout program for me."];

  // Training goal
  if (userInformation.programGoal) {
    parts.push(
      `The primary training goal is ${userInformation.programGoal.toLowerCase()}. Structure the program around that goal — rep ranges, intensity, volume, and exercise selection should all reflect this.`,
    );
  }

  // Program length
  if (userInformation.programLength) {
    parts.push(
      `The program is intended to be ${userInformation.programLength} long. Design the week's structure with this duration in mind.`,
    );
  }

  // Program split
  if (userInformation.programSplit) {
    parts.push(
      `Use a ${userInformation.programSplit.toLowerCase()} structure as the primary weekly split template.`,
    );
  } else {
    parts.push(
      "Choose a balanced weekly split that best fits the user's goals and recovery needs.",
    );
  }

  // Days per week
  if (selectedDaysPerWeek) {
    parts.push(`Return exactly ${selectedDaysPerWeek} workout days for the week.`);
  } else {
    parts.push(
      "Choose a sensible training frequency and return between 3 and 5 workout days for the week.",
    );
  }

  parts.push(
    "Use real weekday names for each workout day, choose sensible weekdays based on split, recovery, and goals, and return them in chronological order.",
    "Do not include rest days or recovery-only days in the JSON response.",
    "If the selected split and training frequency are an awkward match, adapt the split intelligently while keeping the overall intent.",
  );

  // Target muscles
  if (userInformation.bodyParts.length > 0) {
    parts.push(
      `Distribute extra weekly emphasis across these body parts: ${userInformation.bodyParts.join(", ")}.`,
    );
  }

  // Experience level
  if (userInformation.experienceLevel) {
    parts.push(
      `The user is at a ${userInformation.experienceLevel.toLowerCase()} experience level. Match weekly volume, movement complexity, and recovery demand appropriately.`,
    );
  }

  // Duration
  if (userInformation.desiredDuration) {
    parts.push(
      `Target each workout day to last about ${userInformation.desiredDuration}. Keep each workout close to that target while still being realistic.`,
    );
  }

  // Gym setup
  if (userInformation.gymProfile) {
    parts.push(`Available gym setup: ${userInformation.gymProfile.toLowerCase()}.`);
  }

  if (userInformation.availableEquipment.length > 0) {
    parts.push(
      `Additional equipment available: ${userInformation.availableEquipment.join(", ")}.`,
    );
  }

  if (userInformation.gymProfile || userInformation.availableEquipment.length > 0) {
    parts.push(
      "Only include exercises that can be performed with the available setup, listed equipment, or bodyweight.",
    );
  }

  // Additional details
  if (userInformation.additionalDetails) {
    parts.push(`Additional details: ${userInformation.additionalDetails}.`);
  }

  parts.push(`

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
      : 'between 3 and 5 workout entries in "days"'
  }
- Every entry in "days" must be a workout day
- Every "day" value must be a real weekday name
- Order the "days" entries chronologically within the week
- Do not include rest days or recovery-only days
- Every workout day must include "title", "estimatedDuration", and at least 4 "exercises"
- "focus", "notes", "weeklyOverview", and "weeklyNotes" are optional

Remember: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`);

  return parts.join(" ");
}
