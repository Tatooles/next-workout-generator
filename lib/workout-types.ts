import { z } from "zod";

export const ExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().positive(),
  reps: z.string().min(1), // "8-10", "AMRAP", etc.
  restTime: z.string().min(1), // "60s", "90s", etc.
  muscleGroups: z.array(z.string()).min(1),
  formTips: z.array(z.string()), // No minimum required
});

export const WorkoutDataSchema = z.object({
  exercises: z.array(ExerciseSchema).min(1), // At least 1 exercise
  estimatedDuration: z.string().min(1),
  notes: z.string().optional(),
});

// Infer TypeScript types from schemas
export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutData = z.infer<typeof WorkoutDataSchema>;
