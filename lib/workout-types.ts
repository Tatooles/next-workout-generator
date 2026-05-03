import { z } from "zod";
import type { ProgramTrainingDaysPerWeek } from "@/lib/workout-options";

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
  restTime: z.string().min(1), // "1 min", "1.5 min", etc.
  muscleGroups: z.array(z.string()).min(1),
  formTips: z.array(z.string()),
});

export const WorkoutDataSchema = z.object({
  exercises: z.array(ExerciseSchema).min(4),
  estimatedDuration: z.string().min(1),
  notes: z.string().optional(),
});

const ProgramDayDataSchema = z.object({
  day: z.enum(weekDays),
  title: z.string().min(1),
  focus: z.string().min(1).optional(),
  estimatedDuration: z.string().min(1),
  exercises: z.array(ExerciseSchema).min(4),
  notes: z.string().optional(),
});

const BaseProgramDataSchema = z
  .object({
    weeklyOverview: z.string().optional(),
    progressionNotes: z.string().optional(),
    days: z.array(ProgramDayDataSchema).min(2).max(6),
  })
  .superRefine((value, ctx) => {
    const seenDays = new Set<string>();
    let previousDayIndex = -1;

    value.days.forEach((day, index) => {
      if (seenDays.has(day.day)) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "day"],
          message: "Days must be unique.",
        });
      }

      seenDays.add(day.day);

      const currentDayIndex = weekDays.indexOf(day.day);
      if (currentDayIndex <= previousDayIndex) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "day"],
          message: `Days must be ordered chronologically: ${weekDays.join(", ")}.`,
        });
      }

      previousDayIndex = currentDayIndex;
    });
  });

export function createProgramDataSchema(
  expectedDaysPerWeek?: ProgramTrainingDaysPerWeek | null,
) {
  return BaseProgramDataSchema.superRefine((value, ctx) => {
    if (
      expectedDaysPerWeek !== null &&
      expectedDaysPerWeek !== undefined &&
      value.days.length !== expectedDaysPerWeek
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: `Program must contain exactly ${expectedDaysPerWeek} training days.`,
      });
    } else if (
      (expectedDaysPerWeek === null || expectedDaysPerWeek === undefined) &&
      (value.days.length < 3 || value.days.length > 5)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: "Program must contain 3, 4, or 5 training days.",
      });
    }
  });
}

export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutData = z.infer<typeof WorkoutDataSchema>;
export type ProgramDay = z.infer<typeof ProgramDayDataSchema>;
export type ProgramData = z.infer<typeof BaseProgramDataSchema>;
