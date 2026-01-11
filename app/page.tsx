"use client";

import { useEffect, useRef } from "react";
import { WorkoutHeader } from "@/components/workout-header";
import { SplitWorkoutSelector } from "@/components/split-workout-selector";
import { BodyPartsSelector } from "@/components/body-parts-selector";
import { AdditionalDetailsInput } from "@/components/additional-details-input";
import { SubmitButton } from "@/components/submit-button";
import { WorkoutResults } from "@/components/workout-results";
import { useWorkoutForm } from "@/lib/hooks/use-workout-form";
import { useWorkoutSubmit } from "@/lib/hooks/use-workout-submit";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";

export default function Home() {
  const workoutForm = useWorkoutForm();
  const { answer, loading, submitWorkout } = useWorkoutSubmit();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when answer appears
  useEffect(() => {
    if (answer && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [answer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await submitWorkout(e, {
      bodyParts: workoutForm.selectedBodyParts,
      workoutType: workoutForm.workoutType,
      additionalDetails: workoutForm.additionalDetails || null,
      model: workoutForm.model,
    });
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Header */}
        <WorkoutHeader
          model={workoutForm.model}
          onModelChange={workoutForm.setModel}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Selectors */}
          <div className="space-y-4">
            <SplitWorkoutSelector
              workoutType={workoutForm.workoutType}
              onWorkoutTypeChange={workoutForm.setWorkoutType}
            />
            <BodyPartsSelector
              selectedBodyParts={workoutForm.selectedBodyParts}
              onToggle={workoutForm.handleBodyPartToggle}
            />
          </div>

          {/* Additional Details */}
          <AdditionalDetailsInput
            value={workoutForm.additionalDetails}
            onChange={workoutForm.setAdditionalDetails}
          />

          {/* Submit Button */}
          <SubmitButton loading={loading} canSubmit={workoutForm.canSubmit} />
        </form>

        {/* Results */}
        {answer && (
          <WorkoutResults
            ref={resultsRef}
            answer={answer}
            onCopy={() => copyToClipboard(answer)}
            copied={copied}
          />
        )}
      </div>
    </main>
  );
}
