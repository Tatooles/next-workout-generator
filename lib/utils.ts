import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  type EquipmentOption,
  type ExperienceLevel,
  type GymProfile,
  type MuscleGroup,
  type ProgramGoal,
  type ProgramLength,
  type ProgramSplit,
  type ProgramTrainingDaysPerWeek,
  type WorkoutDuration,
  type WorkoutType,
} from "./workout-options";
import type { ProgramData, WorkoutData } from "./workout-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export interface GenerationParams {
  bodyParts: MuscleGroup[];
  workoutType: WorkoutType | null;
  programSplit: ProgramSplit | null;
  programTrainingDaysPerWeek: ProgramTrainingDaysPerWeek | null;
  programGoal: ProgramGoal | null;
  programLength: ProgramLength | null;
  additionalDetails: string | null;
  experienceLevel: ExperienceLevel | null;
  desiredDuration: WorkoutDuration | null;
  gymProfile: GymProfile | null;
  availableEquipment: EquipmentOption[];
  model: string;
}

export type WorkoutParams = GenerationParams;

async function fetchGeneration<T>(
  endpoint: string,
  params: GenerationParams,
  key: "workout" | "program",
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate ${noun}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  if (!data[key]) throw new Error("Invalid response format from server");
  return data[key];
}

export async function fetchWorkout(
  params: GenerationParams,
  signal?: AbortSignal,
): Promise<WorkoutData> {
  return fetchGeneration<WorkoutData>("/api/workout", params, "workout", signal);
}

export async function fetchProgram(
  params: GenerationParams,
  signal?: AbortSignal,
): Promise<ProgramData> {
  return fetchGeneration<ProgramData>("/api/program", params, "program", signal);
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

export function formatWorkoutAsTemplate(workout: WorkoutData): string {
  let text = `Workout Plan\nEstimated Duration: ${workout.estimatedDuration}\n${"=".repeat(50)}\n\n`;

  workout.exercises.forEach((exercise, index) => {
    text += `${index + 1}. ${exercise.name}\n`;
    text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
    text += `   Targets: ${exercise.muscleGroups.join(", ")}\n\n`;
    for (let i = 1; i <= exercise.sets; i++) text += `   Set ${i}: \n`;
    text += `\n`;
  });

  if (workout.notes) text += `${"-".repeat(50)}\nNotes:\n${workout.notes}\n`;
  return text;
}

export function formatProgramAsText(program: ProgramData): string {
  let text = `Weekly Program\n${"=".repeat(50)}\n\n`;

  if (program.weeklyOverview) text += `Overview:\n${program.weeklyOverview}\n\n`;

  program.days.forEach((day) => {
    text += `${day.day} - ${day.title}\n`;
    if (day.focus) text += `Focus: ${day.focus}\n`;
    if (day.estimatedDuration) text += `Estimated Duration: ${day.estimatedDuration}\n`;

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

  if (program.weeklyNotes) text += `Weekly Notes:\n${program.weeklyNotes}\n`;
  return text.trimEnd();
}

export function formatProgramAsTemplate(program: ProgramData): string {
  let text = `Weekly Program Template\n${"=".repeat(50)}\n\n`;

  if (program.weeklyOverview) text += `Overview:\n${program.weeklyOverview}\n\n`;

  program.days.forEach((day) => {
    text += `${day.day} - ${day.title}\n`;
    if (day.focus) text += `Focus: ${day.focus}\n`;
    if (day.estimatedDuration) text += `Estimated Duration: ${day.estimatedDuration}\n`;

    text += "\n";
    day.exercises.forEach((exercise, index) => {
      text += `${index + 1}. ${exercise.name}\n`;
      text += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.restTime}\n`;
      text += `   Targets: ${exercise.muscleGroups.join(", ")}\n\n`;
      for (let i = 1; i <= exercise.sets; i++) text += `   Set ${i}: \n`;
      text += "\n";
    });

    if (day.notes) text += `Notes: ${day.notes}\n`;
    text += `${"-".repeat(50)}\n`;
  });

  if (program.weeklyNotes) text += `Weekly Notes:\n${program.weeklyNotes}\n`;
  return text.trimEnd();
}
