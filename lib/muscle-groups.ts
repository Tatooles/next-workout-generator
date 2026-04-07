import {
  Dumbbell,
  Zap,
  Heart,
  Activity,
  Target,
  Flame,
  LucideIcon,
} from "lucide-react";

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
  "upper back": { icon: Activity, color: "muscle-upper", category: "upper" },
  "front delts": { icon: Target, color: "muscle-shoulders", category: "shoulders" },
  "rear delts": { icon: Target, color: "muscle-shoulders", category: "shoulders" },
  "side delts": { icon: Target, color: "muscle-shoulders", category: "shoulders" },
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

