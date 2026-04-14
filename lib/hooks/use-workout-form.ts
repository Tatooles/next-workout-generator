"use client";

import { useState } from "react";
import type { GenerationMode } from "@/lib/generation-types";
import type { GenerationParams } from "@/lib/utils";
import {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  ProgramSplit,
  ProgramTrainingDaysPerWeek,
  WorkoutDuration,
  WorkoutType,
} from "@/lib/workout-options";

export function useWorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
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
  const [model, setModel] = useState("google/gemini-3-flash-preview");

  const handleBodyPartToggle = (bodyPart: MuscleGroup, checked: boolean) => {
    if (checked) {
      setSelectedBodyParts([...selectedBodyParts, bodyPart]);
    } else {
      setSelectedBodyParts(selectedBodyParts.filter((bp) => bp !== bodyPart));
    }
  };

  const setGymProfile = (value: GymProfile | null) => {
    setGymProfileState(value);

    if (value === "Full Commercial Gym") {
      setAvailableEquipment([]);
    }
  };

  const handleEquipmentToggle = (
    equipment: EquipmentOption,
    checked: boolean,
  ) => {
    if (gymProfile === "Full Commercial Gym") {
      return;
    }

    if (checked) {
      setAvailableEquipment((current) => [...current, equipment]);
    } else {
      setAvailableEquipment((current) =>
        current.filter((item) => item !== equipment),
      );
    }
  };

  const hasSharedInputs =
    selectedBodyParts.length > 0 ||
    additionalDetails.trim().length > 0 ||
    !!experienceLevel ||
    !!desiredDuration ||
    !!gymProfile ||
    availableEquipment.length > 0;

  const canSubmit = (mode: GenerationMode) => {
    if (mode === "program") {
      return hasSharedInputs || !!programSplit || !!programTrainingDaysPerWeek;
    }

    return hasSharedInputs || !!workoutType;
  };

  const getGenerationParams = (mode: GenerationMode): GenerationParams => {
    const trimmedAdditionalDetails = additionalDetails.trim();

    return {
      bodyParts: selectedBodyParts,
      workoutType: mode === "workout" ? workoutType : null,
      programSplit: mode === "program" ? programSplit : null,
      programTrainingDaysPerWeek:
        mode === "program" ? programTrainingDaysPerWeek : null,
      additionalDetails: trimmedAdditionalDetails || null,
      experienceLevel,
      desiredDuration,
      gymProfile,
      availableEquipment,
      model,
    };
  };

  return {
    workoutType,
    setWorkoutType,
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
