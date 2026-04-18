import { clsx, type ClassValue } from "clsx";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  WorkoutDuration,
  WorkoutType,
} from "./workout-options";
import { WorkoutDataSchema, type WorkoutData } from "./workout-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  experienceLevel: ExperienceLevel | null;
  desiredDuration: WorkoutDuration | null;
  gymProfile: GymProfile | null;
  availableEquipment: EquipmentOption[];
  model: string;
}

export async function fetchWorkout(
  params: WorkoutParams,
): Promise<WorkoutData> {
  const response = await fetch("/api/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorMessage = await readResponseError(response);
    throw new Error(errorMessage || "Failed to generate workout");
  }

  const responseSchema = z.union([
    z.object({ workout: WorkoutDataSchema }),
    z.object({ error: z.string() }),
  ]);
  const parsedResponse = responseSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error("Invalid response format from server");
  }

  if ("error" in parsedResponse.data) {
    throw new Error(parsedResponse.data.error);
  }

  return parsedResponse.data.workout;
}

async function readResponseError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!body) {
    return "";
  }

  if (!contentType.includes("application/json")) {
    return body;
  }

  try {
    const parsed = JSON.parse(body) as {
      error?: string;
      message?: string;
    };

    if (typeof parsed.error === "string" && parsed.error.trim()) {
      return parsed.error;
    }

    if (typeof parsed.message === "string" && parsed.message.trim()) {
      return parsed.message;
    }
  } catch {
    return body;
  }

  return body;
}

export function formatWorkoutAsText(workout: WorkoutData): string {
  return buildWorkoutDocument(workout, {
    includeFormTips: true,
    includeSetPlaceholders: false,
  });
}

export function formatWorkoutAsTemplate(workout: WorkoutData): string {
  return buildWorkoutDocument(workout, {
    includeFormTips: false,
    includeSetPlaceholders: true,
  });
}

interface WorkoutDocumentOptions {
  includeFormTips: boolean;
  includeSetPlaceholders: boolean;
}

function buildWorkoutDocument(
  workout: WorkoutData,
  options: WorkoutDocumentOptions,
): string {
  const lines: string[] = [];

  lines.push("Workout Plan");
  lines.push(`Estimated Duration: ${workout.estimatedDuration}`);
  lines.push("=".repeat(50), "");

  workout.exercises.forEach((exercise, index) => {
    lines.push(`${index + 1}. ${exercise.name}`);
    lines.push(
      `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}`,
    );
    lines.push(`   Targets: ${exercise.muscleGroups.join(", ")}`);

    if (options.includeFormTips && exercise.formTips.length > 0) {
      lines.push("   Form Tips:");
      exercise.formTips.forEach((tip) => {
        lines.push(`   • ${tip}`);
      });
    }

    if (options.includeSetPlaceholders) {
      lines.push("");
      for (let set = 1; set <= exercise.sets; set += 1) {
        lines.push(`   Set ${set}: `);
      }
    }

    lines.push("");
  });

  if (workout.notes) {
    lines.push("-".repeat(50));
    lines.push("Notes:");
    lines.push(workout.notes);
  }

  return lines.join("\n");
}
