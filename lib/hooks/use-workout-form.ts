"use client";

import { useState } from "react";
import { MuscleGroup, WorkoutType } from "@/lib/muscle-groups";
import {
  EquipmentOption,
  GymProfile,
  WorkoutDuration,
} from "@/lib/workout-preferences";

export function useWorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<MuscleGroup[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [desiredDuration, setDesiredDuration] = useState<WorkoutDuration | null>(
    null,
  );
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

    if (value === "full commercial gym") {
      setAvailableEquipment([]);
    }
  };

  const handleEquipmentToggle = (
    equipment: EquipmentOption,
    checked: boolean,
  ) => {
    if (gymProfile === "full commercial gym") {
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
