import { z } from "zod";
import { muscleGroups, workoutTypes } from "@/lib/muscle-groups";

export const workoutDurations = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "75+ minutes",
] as const;

export type WorkoutDuration = (typeof workoutDurations)[number];

export const gymProfiles = [
  "bodyweight only",
  "minimal apartment/hotel gym",
  "home dumbbells and bench",
  "full commercial gym",
] as const;

export type GymProfile = (typeof gymProfiles)[number];

export const equipmentOptions = [
  "dumbbells",
  "adjustable bench",
  "barbell and plates",
  "kettlebells",
  "resistance bands",
  "pull-up bar",
  "cable machine",
  "selectorized machines",
  "cardio machine",
] as const;

export type EquipmentOption = (typeof equipmentOptions)[number];

export const WorkoutRequestSchema = z
  .object({
    bodyParts: z.array(z.enum(muscleGroups)).default([]),
    workoutType: z.enum(workoutTypes).nullable().optional(),
    additionalDetails: z.string().max(500).nullable().optional(),
    desiredDuration: z.enum(workoutDurations).nullable().optional(),
    gymProfile: z.enum(gymProfiles).nullable().optional(),
    availableEquipment: z.array(z.enum(equipmentOptions)).default([]),
    model: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.gymProfile === "full commercial gym" &&
      value.availableEquipment.length > 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["availableEquipment"],
        message:
          "Additional equipment should not be provided for full commercial gym.",
      });
    }
  });

export type WorkoutRequest = z.infer<typeof WorkoutRequestSchema>;
