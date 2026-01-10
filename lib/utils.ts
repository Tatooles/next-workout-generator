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
 * Stream workout response from API
 * @param params - Workout generation parameters
 * @yields string chunks as they arrive from the API
 */
export async function* streamWorkoutResponse(
  params: WorkoutParams,
): AsyncGenerator<string, void, unknown> {
  const response = await fetch("/api/workout", {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to generate workout");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
}
