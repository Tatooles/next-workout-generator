"use client";

import { useState } from "react";
import { MuscleGroup, WorkoutType } from "@/lib/muscle-groups";

export function useWorkoutForm() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<MuscleGroup[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [model, setModel] = useState("google/gemini-3-flash-preview");

  const handleBodyPartToggle = (bodyPart: MuscleGroup, checked: boolean) => {
    if (checked) {
      setSelectedBodyParts([...selectedBodyParts, bodyPart]);
    } else {
      setSelectedBodyParts(selectedBodyParts.filter((bp) => bp !== bodyPart));
    }
  };

  const canSubmit = !!workoutType || selectedBodyParts.length > 0;

  return {
    workoutType,
    setWorkoutType,
    selectedBodyParts,
    handleBodyPartToggle,
    additionalDetails,
    setAdditionalDetails,
    model,
    setModel,
    canSubmit,
  };
}

