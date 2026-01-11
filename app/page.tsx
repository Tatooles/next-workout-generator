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
import { formatWorkoutAsText } from "@/lib/utils";

export default function Home() {
  const workoutForm = useWorkoutForm();
  const { workoutData, error, loading, submitWorkout } = useWorkoutSubmit();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when workout data appears
  useEffect(() => {
    if (workoutData && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [workoutData]);

  // Handle copying workout as formatted text
  const handleCopyWorkout = () => {
    if (workoutData) {
      const formattedText = formatWorkoutAsText(workoutData);
      copyToClipboard(formattedText);
    }
  };

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
        {workoutData && (
          <WorkoutResults
            ref={resultsRef}
            workout={workoutData}
            onCopy={handleCopyWorkout}
            copied={copied}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive animate-in fade-in slide-in-from-bottom-4 border-destructive/20 mt-6 rounded-lg border p-4 duration-500 sm:mt-8 sm:p-6">
            <p className="mb-1 font-semibold">Error generating workout</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
