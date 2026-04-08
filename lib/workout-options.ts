import {
  Dumbbell,
  Zap,
  Heart,
  Activity,
  Target,
  Flame,
  LucideIcon,
} from "lucide-react";
import { z } from "zod";

export const muscleGroups = [
  "quads",
  "hamstrings",
  "glutes",
  "triceps",
  "biceps",
  "chest",
  "lats",
  "upper back",
  "front delts",
  "rear delts",
  "side delts",
  "abs",
] as const;

export type MuscleGroup = (typeof muscleGroups)[number];

export const workoutTypes = [
  "leg workout",
  "push workout",
  "pull workout",
  "upper body workout",
  "lower body workout",
  "full body workout",
] as const;

export type WorkoutType = (typeof workoutTypes)[number];

export interface MuscleGroupConfig {
  icon: LucideIcon;
  color: string;
  category: "legs" | "arms" | "upper" | "shoulders" | "core";
}

export const muscleGroupConfig: Record<MuscleGroup, MuscleGroupConfig> = {
  quads: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  hamstrings: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  glutes: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  triceps: { icon: Zap, color: "muscle-arms", category: "arms" },
  biceps: { icon: Zap, color: "muscle-arms", category: "arms" },
  chest: { icon: Heart, color: "muscle-upper", category: "upper" },
  lats: { icon: Activity, color: "muscle-upper", category: "upper" },
  "upper back": {
    icon: Activity,
    color: "muscle-upper",
    category: "upper",
  },
  "front delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  "rear delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  "side delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  abs: { icon: Flame, color: "muscle-core", category: "core" },
};

export const workoutTypeIcons: Record<WorkoutType, LucideIcon> = {
  "leg workout": Dumbbell,
  "push workout": Zap,
  "pull workout": Activity,
  "upper body workout": Heart,
  "lower body workout": Dumbbell,
  "full body workout": Flame,
};

export const workoutDurations = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "75+ minutes",
] as const;

export type WorkoutDuration = (typeof workoutDurations)[number];

export const experienceLevels = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

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
    experienceLevel: z.enum(experienceLevels).nullable().optional(),
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
