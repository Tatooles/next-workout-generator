import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MuscleGroup, WorkoutType } from "./muscle-groups";

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
 * @returns Promise with the complete workout text
 */
export async function fetchWorkout(params: WorkoutParams): Promise<string> {
  const response = await fetch("/api/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to generate workout");
  }

  const data = await response.json();
  return data.content;
}
