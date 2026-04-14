"use client";

import { useEffect, useRef, useState } from "react";
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const cancelGeneration = () => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const submitGeneration = async (
    mode: GenerationMode,
    params: GenerationParams,
  ) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const isCurrentRequest = () =>
      requestIdRef.current === requestId && !controller.signal.aborted;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      if (mode === "program") {
        const program = await fetchProgram(params, controller.signal);
        if (!isCurrentRequest()) {
          return;
        }
        setResult({ mode: "program", program });
      } else {
        const workout = await fetchWorkout(params, controller.signal);
        if (!isCurrentRequest()) {
          return;
        }
        setResult({ mode: "workout", workout });
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      if (!isCurrentRequest()) {
        return;
      }

      console.error("Error fetching response:", error);
      const noun = mode === "program" ? "program" : "workout";
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to generate ${noun}. Please try again.`;
      setError(errorMessage);
    } finally {
      if (isCurrentRequest()) {
        abortControllerRef.current = null;
        setLoading(false);
      }
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
    cancelGeneration,
    resetGeneration,
  };
}
