import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import type { GenerationParams } from "./generation-types";
import {
  createProgramDataSchema,
  WorkoutDataSchema,
  type ProgramData,
  type WorkoutData,
} from "./workout-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyToClipboardWithTextarea(text);
  }
}

function copyToClipboardWithTextarea(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

async function getErrorMessage(response: Response, noun: string) {
  const fallbackMessage = `Failed to generate ${noun}`;
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!contentType.includes("application/json")) {
    return fallbackMessage;
  }

  const errorData: unknown = await response.json();
  const parsedError = z.object({ error: z.string() }).safeParse(errorData);

  if (parsedError.success) {
    return parsedError.data.error;
  }

  return fallbackMessage;
}

async function fetchGeneration<T>(
  endpoint: string,
  params: GenerationParams,
  key: "workout" | "program",
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const noun = key === "program" ? "program" : "workout";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, noun));
  }

  const data: unknown = await response.json();
  const parsedError = z.object({ error: z.string() }).safeParse(data);

  if (parsedError.success) {
    throw new Error(parsedError.data.error);
  }

  const parsedValue = z.object({ [key]: schema }).safeParse(data);

  if (!parsedValue.success) {
    throw new Error("Invalid response format from server");
  }

  return parsedValue.data[key];
}

export async function fetchWorkout(
  params: GenerationParams,
  signal?: AbortSignal,
): Promise<WorkoutData> {
  return fetchGeneration<WorkoutData>(
    "/api/workout",
    params,
    "workout",
    WorkoutDataSchema,
    signal,
  );
}

export async function fetchProgram(
  params: GenerationParams,
  signal?: AbortSignal,
): Promise<ProgramData> {
  return fetchGeneration<ProgramData>(
    "/api/program",
    params,
    "program",
    createProgramDataSchema(params.programTrainingDaysPerWeek),
    signal,
  );
}

export function formatWorkoutAsText(workout: WorkoutData): string {
  let text = `Workout Plan\nEstimated Duration: ${workout.estimatedDuration}\n${"=".repeat(50)}\n\n`;

  workout.exercises.forEach((exercise, index) => {
    text += `${index + 1}. ${exercise.name}\n`;
    text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
    text += `   Targets: ${exercise.muscleGroups.join(", ")}\n`;
    if (exercise.formTips?.length) {
      text += `   Form Tips:\n`;
      exercise.formTips.forEach((tip) => (text += `   • ${tip}\n`));
    }
    text += `\n`;
  });

  if (workout.notes) text += `${"-".repeat(50)}\nNotes:\n${workout.notes}\n`;
  return text;
}

export function formatProgramAsText(program: ProgramData): string {
  let text = `Weekly Program\n${"=".repeat(50)}\n\n`;

  if (program.weeklyOverview)
    text += `Overview:\n${program.weeklyOverview}\n\n`;

  program.days.forEach((day) => {
    text += `${day.day} - ${day.title}\n`;
    if (day.focus) text += `Focus: ${day.focus}\n`;
    if (day.estimatedDuration)
      text += `Estimated Duration: ${day.estimatedDuration}\n`;

    if (day.exercises.length > 0) {
      text += "\n";
      day.exercises.forEach((exercise, index) => {
        text += `${index + 1}. ${exercise.name}\n`;
        text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
        text += `   Targets: ${exercise.muscleGroups.join(", ")}\n`;
        if (exercise.formTips.length > 0) {
          text += "   Form Tips:\n";
          exercise.formTips.forEach((tip) => (text += `   • ${tip}\n`));
        }
        text += "\n";
      });
    }

    if (day.notes) text += `Notes: ${day.notes}\n`;
    text += `${"-".repeat(50)}\n`;
  });

  if (program.progressionNotes) {
    text += `Progression Plan:\n${program.progressionNotes}\n`;
  }
  return text.trimEnd();
}
