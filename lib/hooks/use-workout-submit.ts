"use client";

import { useState } from "react";
import { fetchWorkout, WorkoutParams } from "@/lib/utils";
import type { WorkoutData } from "@/lib/workout-types";

export function useWorkoutSubmit() {
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitWorkout = async (
    e: React.FormEvent<HTMLFormElement>,
    params: WorkoutParams,
  ) => {
    e.preventDefault();

    setLoading(true);
    setWorkoutData(null);
    setError(null);

    try {
      const result = await fetchWorkout(params);
      setWorkoutData(result);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate workout. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetWorkout = () => {
    setWorkoutData(null);
    setError(null);
  };

  return {
    workoutData,
    error,
    loading,
    submitWorkout,
    resetWorkout,
  };
}
