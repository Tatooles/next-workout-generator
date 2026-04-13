import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  ProgramSplit,
  WorkoutDuration,
  WorkoutType,
} from "./workout-options";
import type { ProgramData, WorkoutData } from "./workout-types";

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

export interface GenerationParams {
  bodyParts: MuscleGroup[];
  workoutType: WorkoutType | null;
  programSplit: ProgramSplit | null;
  additionalDetails: string | null;
  experienceLevel: ExperienceLevel | null;
  desiredDuration: WorkoutDuration | null;
  gymProfile: GymProfile | null;
  availableEquipment: EquipmentOption[];
  model: string;
}

export type WorkoutParams = GenerationParams;

/**
 * Fetch workout response from API
 * @param params - Workout generation parameters
 * @returns Promise with the structured workout data
 */
async function fetchGeneration<T>(
  endpoint: string,
  params: GenerationParams,
  key: "workout" | "program",
): Promise<T> {
  const response = await fetch(endpoint, {
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

  if (!data[key]) {
    throw new Error("Invalid response format from server");
  }

  return data[key];
}

/**
 * Fetch workout response from API
 * @param params - Workout generation parameters
 * @returns Promise with the structured workout data
 */
export async function fetchWorkout(
  params: GenerationParams,
): Promise<WorkoutData> {
  return fetchGeneration<WorkoutData>("/api/workout", params, "workout");
}

/**
 * Fetch program response from API
 * @param params - Program generation parameters
 * @returns Promise with the structured program data
 */
export async function fetchProgram(
  params: GenerationParams,
): Promise<ProgramData> {
  return fetchGeneration<ProgramData>("/api/program", params, "program");
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

/**
 * Format structured workout data as a fillable template for copying
 * @param workout - Structured workout data
 * @returns Formatted template string with blank lines for tracking
 */
export function formatWorkoutAsTemplate(workout: WorkoutData): string {
  let text = "";

  // Add header with duration
  text += `Workout Plan\n`;
  text += `Estimated Duration: ${workout.estimatedDuration}\n`;
  text += `${"=".repeat(50)}\n\n`;

  // Add each exercise
  workout.exercises.forEach((exercise, index) => {
    text += `${index + 1}. ${exercise.name}\n`;
    text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
    text += `   Targets: ${exercise.muscleGroups.join(", ")}\n\n`;

    // Add blank lines for each set
    for (let i = 1; i <= exercise.sets; i++) {
      text += `   Set ${i}: \n`;
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

/**
 * Format structured program data as readable text for copying
 * @param program - Structured weekly program data
 * @returns Formatted text string
 */
export function formatProgramAsText(program: ProgramData): string {
  let text = "Weekly Program\n";
  text += `${"=".repeat(50)}\n\n`;

  if (program.weeklyOverview) {
    text += `Overview:\n${program.weeklyOverview}\n\n`;
  }

  program.days.forEach((day) => {
    text += `${day.day} - ${day.title}\n`;
    text += `Type: ${day.type === "workout" ? "Workout" : "Rest / Recovery"}\n`;

    if (day.focus) {
      text += `Focus: ${day.focus}\n`;
    }

    if (day.estimatedDuration) {
      text += `Estimated Duration: ${day.estimatedDuration}\n`;
    }

    if (day.exercises.length > 0) {
      text += "\n";
      day.exercises.forEach((exercise, index) => {
        text += `${index + 1}. ${exercise.name}\n`;
        text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
        text += `   Targets: ${exercise.muscleGroups.join(", ")}\n`;

        if (exercise.formTips.length > 0) {
          text += "   Form Tips:\n";
          exercise.formTips.forEach((tip) => {
            text += `   • ${tip}\n`;
          });
        }

        text += "\n";
      });
    }

    if (day.notes) {
      text += `Notes: ${day.notes}\n`;
    }

    text += `${"-".repeat(50)}\n`;
  });

  if (program.weeklyNotes) {
    text += `Weekly Notes:\n${program.weeklyNotes}\n`;
  }

  return text.trimEnd();
}

/**
 * Format structured program data as a fillable template for copying
 * @param program - Structured weekly program data
 * @returns Formatted template string with blank lines for tracking
 */
export function formatProgramAsTemplate(program: ProgramData): string {
  let text = "Weekly Program Template\n";
  text += `${"=".repeat(50)}\n\n`;

  if (program.weeklyOverview) {
    text += `Overview:\n${program.weeklyOverview}\n\n`;
  }

  program.days.forEach((day) => {
    text += `${day.day} - ${day.title}\n`;

    if (day.focus) {
      text += `Focus: ${day.focus}\n`;
    }

    if (day.estimatedDuration) {
      text += `Estimated Duration: ${day.estimatedDuration}\n`;
    }

    if (day.exercises.length === 0) {
      if (day.notes) {
        text += `Notes: ${day.notes}\n`;
      }

      text += `${"-".repeat(50)}\n`;
      return;
    }

    text += "\n";
    day.exercises.forEach((exercise, index) => {
      text += `${index + 1}. ${exercise.name}\n`;
      text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
      text += `   Targets: ${exercise.muscleGroups.join(", ")}\n\n`;

      for (let i = 1; i <= exercise.sets; i++) {
        text += `   Set ${i}: \n`;
      }

      text += "\n";
    });

    if (day.notes) {
      text += `Notes: ${day.notes}\n`;
    }

    text += `${"-".repeat(50)}\n`;
  });

  if (program.weeklyNotes) {
    text += `Weekly Notes:\n${program.weeklyNotes}\n`;
  }

  return text.trimEnd();
}
