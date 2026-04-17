"use client";

import { useState } from "react";
import {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  WorkoutDuration,
  WorkoutType,
} from "@/lib/workout-options";
import { DEFAULT_AI_MODEL, type AIModelId } from "@/lib/ai-models";

export function useWorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
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
  const [model, setModel] = useState<AIModelId>(DEFAULT_AI_MODEL);

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

  const canSubmit =
    !!workoutType ||
    selectedBodyParts.length > 0 ||
    !!experienceLevel ||
    !!desiredDuration ||
    !!gymProfile ||
    availableEquipment.length > 0;

  return {
    workoutType,
    setWorkoutType,
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
  };
}
