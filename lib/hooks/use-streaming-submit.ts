"use client";

import { useState } from "react";
import { streamWorkoutResponse, WorkoutParams } from "@/lib/utils";

export function useStreamingSubmit() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const submitWorkout = async (
    e: React.FormEvent<HTMLFormElement>,
    params: WorkoutParams
  ) => {
    e.preventDefault();

    setLoading(true);
    setAnswer("");

    try {
      for await (const chunk of streamWorkoutResponse(params)) {
        setAnswer((prev) => prev + chunk);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setLoading(false);
      setAnswer("Failed to generate workout. Please try again.");
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

