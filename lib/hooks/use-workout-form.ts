"use client";

import { useState } from "react";
import type { GenerationMode } from "@/lib/generation-types";
import type { GenerationParams } from "@/lib/utils";
import type {
  EquipmentOption,
  ExperienceLevel,
  GymProfile,
  MuscleGroup,
  ProgramGoal,
  ProgramLength,
  ProgramTrainingDaysPerWeek,
  WorkoutDuration,
  WorkoutType,
} from "@/lib/workout-options";

export function useWorkoutForm() {
  // ── Workout mode ────────────────────────────────────────────────
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);

  // ── Program mode ────────────────────────────────────────────────
  const [programGoal, setProgramGoal] = useState<ProgramGoal | null>(null);
  const [programLength, setProgramLength] = useState<ProgramLength | null>(null);
  const [programTrainingDaysPerWeek, setProgramTrainingDaysPerWeek] =
    useState<ProgramTrainingDaysPerWeek | null>(null);

  // ── Shared ───────────────────────────────────────────────────────
  const [selectedBodyParts, setSelectedBodyParts] = useState<MuscleGroup[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [desiredDuration, setDesiredDuration] = useState<WorkoutDuration | null>(null);
  const [gymProfile, setGymProfileState] = useState<GymProfile | null>(null);
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentOption[]>([]);
  const [model, setModel] = useState("google/gemini-3-flash-preview");

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
    if (mode === "program") return true; // always submittable
    return !!workoutType;               // workout requires split
  };

  const getGenerationParams = (mode: GenerationMode): GenerationParams => ({
    bodyParts: mode === "workout" ? selectedBodyParts : [],
    workoutType: mode === "workout" ? workoutType : null,
    programSplit: null,
    programTrainingDaysPerWeek:
      mode === "program" ? programTrainingDaysPerWeek : null,
    programGoal: mode === "program" ? programGoal : null,
    programLength: mode === "program" ? programLength : null,
    additionalDetails: additionalDetails.trim() || null,
    experienceLevel,
    desiredDuration: mode === "workout" ? desiredDuration : null,
    gymProfile,
    availableEquipment,
    model,
  });

  return {
    workoutType,
    setWorkoutType,
    programGoal,
    setProgramGoal,
    programLength,
    setProgramLength,
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
