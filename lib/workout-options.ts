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
  "Quads",
  "Hamstrings",
  "Glutes",
  "Triceps",
  "Biceps",
  "Chest",
  "Lats",
  "Upper Back",
  "Front Delts",
  "Rear Delts",
  "Side Delts",
  "Abs",
] as const;

export type MuscleGroup = (typeof muscleGroups)[number];

export const workoutTypes = [
  "Leg Workout",
  "Push Workout",
  "Pull Workout",
  "Upper Body Workout",
  "Lower Body Workout",
  "Full Body Workout",
] as const;

export type WorkoutType = (typeof workoutTypes)[number];

export const programSplits = [
  "Push/Pull/Legs",
  "Upper/Lower",
  "Full Body",
  "Body Part Split",
  "Arnold Split",
  "Powerbuilding",
  "Strength + Conditioning",
] as const;

export type ProgramSplit = (typeof programSplits)[number];

export interface MuscleGroupConfig {
  icon: LucideIcon;
  color: string;
  category: "legs" | "arms" | "upper" | "shoulders" | "core";
}

export const muscleGroupConfig: Record<MuscleGroup, MuscleGroupConfig> = {
  Quads: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  Hamstrings: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  Glutes: { icon: Dumbbell, color: "muscle-legs", category: "legs" },
  Triceps: { icon: Zap, color: "muscle-arms", category: "arms" },
  Biceps: { icon: Zap, color: "muscle-arms", category: "arms" },
  Chest: { icon: Heart, color: "muscle-upper", category: "upper" },
  Lats: { icon: Activity, color: "muscle-upper", category: "upper" },
  "Upper Back": {
    icon: Activity,
    color: "muscle-upper",
    category: "upper",
  },
  "Front Delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  "Rear Delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  "Side Delts": {
    icon: Target,
    color: "muscle-shoulders",
    category: "shoulders",
  },
  Abs: { icon: Flame, color: "muscle-core", category: "core" },
};

export const workoutTypeIcons: Record<WorkoutType, LucideIcon> = {
  "Leg Workout": Dumbbell,
  "Push Workout": Zap,
  "Pull Workout": Activity,
  "Upper Body Workout": Heart,
  "Lower Body Workout": Dumbbell,
  "Full Body Workout": Flame,
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
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

export const gymProfiles = [
  "Bodyweight Only",
  "Minimal Apartment/Hotel Gym",
  "Home Dumbbells and Bench",
  "Full Commercial Gym",
] as const;

export type GymProfile = (typeof gymProfiles)[number];

export const equipmentOptions = [
  "Dumbbells",
  "Adjustable Bench",
  "Barbell and Plates",
  "Kettlebells",
  "Resistance Bands",
  "Pull-up Bar",
  "Cable Machine",
  "Selectorized Machines",
  "Cardio Machine",
] as const;

export type EquipmentOption = (typeof equipmentOptions)[number];

export const WorkoutRequestSchema = z
  .object({
    bodyParts: z.array(z.enum(muscleGroups)).default([]),
    workoutType: z.enum(workoutTypes).nullable().optional(),
    programSplit: z.enum(programSplits).nullable().optional(),
    additionalDetails: z.string().max(500).nullable().optional(),
    experienceLevel: z.enum(experienceLevels).nullable().optional(),
    desiredDuration: z.enum(workoutDurations).nullable().optional(),
    gymProfile: z.enum(gymProfiles).nullable().optional(),
    availableEquipment: z.array(z.enum(equipmentOptions)).default([]),
    model: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.gymProfile === "Full Commercial Gym" &&
      value.availableEquipment.length > 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["availableEquipment"],
        message:
          "Additional equipment should not be provided for Full Commercial Gym.",
      });
    }
  });

export type WorkoutRequest = z.infer<typeof WorkoutRequestSchema>;
