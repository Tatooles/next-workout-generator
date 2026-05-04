import type { GenerationModel } from "@/lib/model-options";
import type {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  ProgramGoal,
  ProgramSplit,
  ProgramTrainingDaysPerWeek,
  WorkoutDuration,
  WorkoutType,
} from "@/lib/workout-options";
import type { ProgramData, WorkoutData } from "@/lib/workout-types";

export const generationModes = ["workout", "program"] as const;

export type GenerationMode = (typeof generationModes)[number];

export interface GenerationParams {
  bodyParts: MuscleGroup[];
  workoutType: WorkoutType | null;
  programSplit: ProgramSplit | null;
  programTrainingDaysPerWeek: ProgramTrainingDaysPerWeek | null;
  programGoal: ProgramGoal | null;
  additionalDetails: string | null;
  experienceLevel: ExperienceLevel | null;
  desiredDuration: WorkoutDuration | null;
  gymProfile: GymProfile | null;
  availableEquipment: EquipmentOption[];
  model: GenerationModel;
}

export type GenerationResult =
  | { mode: "workout"; workout: WorkoutData }
  | { mode: "program"; program: ProgramData };
