"use client";

import { useState } from "react";
import type { GenerationMode } from "@/lib/generation-types";
import { fetchProgram, fetchWorkout, type GenerationParams } from "@/lib/utils";
import type { ProgramData, WorkoutData } from "@/lib/workout-types";

export type GenerationResult =
  | { mode: "workout"; workout: WorkoutData }
  | { mode: "program"; program: ProgramData };

export function useGenerationSubmit() {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitGeneration = async (
    e: React.FormEvent<HTMLFormElement>,
    mode: GenerationMode,
    params: GenerationParams,
  ) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      if (mode === "program") {
        const program = await fetchProgram(params);
        setResult({ mode: "program", program });
      } else {
        const workout = await fetchWorkout(params);
        setResult({ mode: "workout", workout });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      const noun = mode === "program" ? "program" : "workout";
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to generate ${noun}. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetGeneration = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    error,
    loading,
    submitGeneration,
    resetGeneration,
  };
}
