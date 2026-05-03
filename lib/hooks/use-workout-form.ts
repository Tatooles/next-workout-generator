"use client";

import { useState } from "react";
import type { GenerationMode, GenerationParams } from "@/lib/generation-types";
import { DEFAULT_MODEL, type GenerationModel } from "@/lib/model-options";
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

export function useWorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);

  const [programGoal, setProgramGoal] = useState<ProgramGoal | null>(null);
  const [programSplit, setProgramSplit] = useState<ProgramSplit | null>(null);
  const [programTrainingDaysPerWeek, setProgramTrainingDaysPerWeek] =
    useState<ProgramTrainingDaysPerWeek | null>(null);

  const [selectedBodyParts, setSelectedBodyParts] = useState<MuscleGroup[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [desiredDuration, setDesiredDuration] =
    useState<WorkoutDuration | null>(null);
  const [gymProfile, setGymProfileState] = useState<GymProfile | null>(null);
  const [availableEquipment, setAvailableEquipment] = useState<
    EquipmentOption[]
  >([]);
  const [model, setModel] = useState<GenerationModel>(DEFAULT_MODEL);

  const handleBodyPartToggle = (bodyPart: MuscleGroup) => {
    setSelectedBodyParts((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((bp) => bp !== bodyPart)
        : [...prev, bodyPart],
    );
  };

  const setGymProfile = (value: GymProfile | null) => {
    setGymProfileState(value);
    if (value === "Full Commercial Gym") setAvailableEquipment([]);
  };

  const handleEquipmentToggle = (equipment: EquipmentOption) => {
    if (gymProfile === "Full Commercial Gym") return;
    setAvailableEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment],
    );
  };

  const canSubmit = (mode: GenerationMode): boolean => {
    if (mode === "program") return !!programSplit;
    return !!workoutType || selectedBodyParts.length > 0;
  };

  const getGenerationParams = (mode: GenerationMode): GenerationParams => ({
    bodyParts: selectedBodyParts,
    workoutType: mode === "workout" ? workoutType : null,
    programSplit: mode === "program" ? programSplit : null,
    programTrainingDaysPerWeek:
      mode === "program" ? programTrainingDaysPerWeek : null,
    programGoal: mode === "program" ? programGoal : null,
    additionalDetails: additionalDetails.trim() || null,
    experienceLevel,
    desiredDuration,
    gymProfile,
    availableEquipment,
    model,
  });

  return {
    workoutType,
    setWorkoutType,
    programGoal,
    setProgramGoal,
    programSplit,
    setProgramSplit,
    programTrainingDaysPerWeek,
    setProgramTrainingDaysPerWeek,
    selectedBodyParts,
    handleBodyPartToggle,
    additionalDetails,
    setAdditionalDetails,
    experienceLevel,
    setExperienceLevel,
    desiredDuration,
    setDesiredDuration,
    gymProfile,
    setGymProfile,
    availableEquipment,
    handleEquipmentToggle,
    model,
    setModel,
    canSubmit,
    getGenerationParams,
  };
}
