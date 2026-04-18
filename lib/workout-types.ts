import { z } from "zod";

const ExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().positive(),
  reps: z.string().min(1),
  restTime: z.string().min(1),
  muscleGroups: z.array(z.string()).min(1),
  formTips: z.array(z.string()),
});

export const WorkoutDataSchema = z.object({
  exercises: z.array(ExerciseSchema).min(1),
  estimatedDuration: z.string().min(1),
  notes: z.string().optional(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutData = z.infer<typeof WorkoutDataSchema>;
