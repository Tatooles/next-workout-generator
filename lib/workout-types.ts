import { z } from "zod";

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

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

const WorkoutProgramDaySchema = z.object({
  day: z.enum(weekDays),
  type: z.literal("workout"),
  title: z.string().min(1),
  focus: z.string().min(1).optional(),
  estimatedDuration: z.string().min(1),
  exercises: z.array(ExerciseSchema).min(1),
  notes: z.string().optional(),
});

const RestProgramDaySchema = z.object({
  day: z.enum(weekDays),
  type: z.literal("rest"),
  title: z.string().min(1),
  focus: z.string().min(1).optional(),
  estimatedDuration: z.string().min(1).optional(),
  exercises: z.array(ExerciseSchema).length(0),
  notes: z.string().optional(),
});

export const ProgramDaySchema = z.discriminatedUnion("type", [
  WorkoutProgramDaySchema,
  RestProgramDaySchema,
]);

export const ProgramDataSchema = z
  .object({
    weeklyOverview: z.string().optional(),
    weeklyNotes: z.string().optional(),
    days: z.array(ProgramDaySchema).length(7),
  })
  .superRefine((value, ctx) => {
    value.days.forEach((day, index) => {
      if (day.day !== weekDays[index]) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "day"],
          message: `Days must be ordered ${weekDays.join(", ")}.`,
        });
      }
    });
  });

// Infer TypeScript types from schemas
export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutData = z.infer<typeof WorkoutDataSchema>;
export type ProgramDay = z.infer<typeof ProgramDaySchema>;
export type ProgramData = z.infer<typeof ProgramDataSchema>;
