import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MuscleGroup, WorkoutType } from "./muscle-groups";
import type { WorkoutData } from "./workout-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

export interface WorkoutParams {
  bodyParts: MuscleGroup[];
  workoutType: WorkoutType | null;
  additionalDetails: string | null;
  model: string;
}

/**
 * Fetch workout response from API
 * @param params - Workout generation parameters
 * @returns Promise with the structured workout data
 */
export async function fetchWorkout(
  params: WorkoutParams,
): Promise<WorkoutData> {
  const response = await fetch("/api/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate workout");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.workout) {
    throw new Error("Invalid response format from server");
  }

  return data.workout;
}

/**
 * Format structured workout data as readable text for copying
 * @param workout - Structured workout data
 * @returns Formatted text string
 */
export function formatWorkoutAsText(workout: WorkoutData): string {
  let text = "";

  // Add header with duration
  text += `Workout Plan\n`;
  text += `Estimated Duration: ${workout.estimatedDuration}\n`;
  text += `${"=".repeat(50)}\n\n`;

  // Add each exercise
  workout.exercises.forEach((exercise, index) => {
    text += `${index + 1}. ${exercise.name}\n`;
    text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
    text += `   Targets: ${exercise.muscleGroups.join(", ")}\n`;

    // Add form tips
    if (exercise.formTips && exercise.formTips.length > 0) {
      text += `   Form Tips:\n`;
      exercise.formTips.forEach((tip) => {
        text += `   • ${tip}\n`;
      });
    }

    text += `\n`;
  });

  // Add general notes if present
  if (workout.notes) {
    text += `${"-".repeat(50)}\n`;
    text += `Notes:\n${workout.notes}\n`;
  }

  return text;
}
