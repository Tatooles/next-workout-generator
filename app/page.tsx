"use client";

import { useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BicepsFlexed, Zap } from "lucide-react";
import { WorkoutHeader } from "@/components/workout-header";
import { SplitWorkoutSelector } from "@/components/split-workout-selector";
import { BodyPartsSelector } from "@/components/body-parts-selector";
import { AdditionalDetailsInput } from "@/components/additional-details-input";
import { SubmitButton } from "@/components/submit-button";
import { WorkoutPreview } from "@/components/workout-preview";
import { WorkoutResults } from "@/components/workout-results";
import { useWorkoutForm } from "@/lib/hooks/use-workout-form";
import { useStreamingSubmit } from "@/lib/hooks/use-streaming-submit";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";

export default function Home() {
  const workoutForm = useWorkoutForm();
  const { answer, loading, submitWorkout } = useStreamingSubmit();
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
          {/* Main Content - Tabs */}
          <Tabs defaultValue="split" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2">
              <TabsTrigger
                value="split"
                className="flex items-center gap-1.5 py-2.5 text-sm sm:gap-2 sm:py-3"
              >
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">Workout Split</span>
                <span className="xs:hidden">Split</span>
              </TabsTrigger>
              <TabsTrigger
                value="bodyparts"
                className="flex items-center gap-1.5 py-2.5 text-sm sm:gap-2 sm:py-3"
              >
                <BicepsFlexed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">Specific Muscles</span>
                <span className="xs:hidden">Muscles</span>
              </TabsTrigger>
            </TabsList>

            {/* Split Workout Tab */}
            <TabsContent value="split" className="mt-6 space-y-4">
              <SplitWorkoutSelector
                workoutType={workoutForm.workoutType}
                onWorkoutTypeChange={workoutForm.setWorkoutType}
              />
            </TabsContent>

            {/* Body Parts Tab */}
            <TabsContent value="bodyparts" className="mt-6 space-y-4">
              <BodyPartsSelector
                selectedBodyParts={workoutForm.selectedBodyParts}
                onToggle={workoutForm.handleBodyPartToggle}
              />
            </TabsContent>
          </Tabs>

          {/* Additional Details */}
          <AdditionalDetailsInput
            value={workoutForm.additionalDetails}
            onChange={workoutForm.setAdditionalDetails}
          />

          {/* Preview Card */}
          <WorkoutPreview
            workoutType={workoutForm.workoutType}
            bodyParts={workoutForm.selectedBodyParts}
            additionalDetails={workoutForm.additionalDetails}
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
