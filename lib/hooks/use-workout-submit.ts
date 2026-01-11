"use client";

import { useState } from "react";
import { fetchWorkout, WorkoutParams } from "@/lib/utils";

export function useWorkoutSubmit() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const submitWorkout = async (
    e: React.FormEvent<HTMLFormElement>,
    params: WorkoutParams,
  ) => {
    e.preventDefault();

    setLoading(true);
    setAnswer("");

    try {
      const result = await fetchWorkout(params);
      setAnswer(result);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAnswer("Failed to generate workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnswer = () => setAnswer("");

  return {
    answer,
    loading,
    submitWorkout,
    resetAnswer,
  };
}
