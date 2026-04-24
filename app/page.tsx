"use client";

import { useEffect, useRef, useState } from "react";
import { ProgramResults } from "@/components/program-results";
import { WorkoutHeader } from "@/components/workout-header";
import { SplitWorkoutSelector } from "@/components/split-workout-selector";
import { ProgramDaysPerWeekSelector } from "@/components/program-days-per-week-selector";
import { ExperienceLevelSelector } from "@/components/experience-level-selector";
import { DurationSelector } from "@/components/duration-selector";
import { BodyPartsSelector } from "@/components/body-parts-selector";
import { EquipmentSelector } from "@/components/equipment-selector";
import { AdditionalDetailsInput } from "@/components/additional-details-input";
import { SubmitButton } from "@/components/submit-button";
import { WorkoutResults } from "@/components/workout-results";
import type { GenerationMode } from "@/lib/generation-types";
import { useGenerationSubmit } from "@/lib/hooks/use-generation-submit";
import { useWorkoutForm } from "@/lib/hooks/use-workout-form";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import {
  formatProgramAsTemplate,
  formatProgramAsText,
  formatWorkoutAsTemplate,
  formatWorkoutAsText,
} from "@/lib/utils";

export default function Home() {
  const [mode, setMode] = useState<GenerationMode>("workout");
  const workoutForm = useWorkoutForm();
  const {
    result,
    error,
    loading,
    submitGeneration,
    cancelGeneration,
    resetGeneration,
  } = useGenerationSubmit();
  const { copiedStates, copyToClipboard } = useCopyToClipboard();
  const resultsRef = useRef<HTMLDivElement>(null);
  const workoutData = result?.mode === "workout" ? result.workout : null;
  const programData = result?.mode === "program" ? result.program : null;

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [result]);

  const handleCopyFull = () => {
    if (workoutData) {
      const formattedText = formatWorkoutAsText(workoutData);
      copyToClipboard(formattedText, "full");
      return;
    }

    if (programData) {
      const formattedText = formatProgramAsText(programData);
      copyToClipboard(formattedText, "full");
    }
  };

  const handleCopyTemplate = () => {
    if (workoutData) {
      const formattedTemplate = formatWorkoutAsTemplate(workoutData);
      copyToClipboard(formattedTemplate, "template");
      return;
    }

    if (programData) {
      const formattedTemplate = formatProgramAsTemplate(programData);
      copyToClipboard(formattedTemplate, "template");
    }
  };

  const handleModeChange = (nextMode: GenerationMode) => {
    if (nextMode === mode) {
      return;
    }

    cancelGeneration();
    resetGeneration();
    setMode(nextMode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitGeneration(mode, workoutForm.getGenerationParams(mode));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[680px] px-5 py-9 pb-24">
        <WorkoutHeader
          mode={mode}
          onModeChange={handleModeChange}
          model={workoutForm.model}
          onModelChange={workoutForm.setModel}
        />

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col divide-y divide-border">
              <div className="pb-6">
                <SplitWorkoutSelector
                  mode={mode}
                  workoutType={workoutForm.workoutType}
                  programSplit={workoutForm.programSplit}
                  onWorkoutTypeChange={workoutForm.setWorkoutType}
                  onProgramSplitChange={workoutForm.setProgramSplit}
                />
              </div>
              {mode === "program" ? (
                <div className="py-6">
                  <ProgramDaysPerWeekSelector
                    value={workoutForm.programTrainingDaysPerWeek}
                    programSplit={workoutForm.programSplit}
                    onValueChange={workoutForm.setProgramTrainingDaysPerWeek}
                  />
                </div>
              ) : null}
              <div className="py-6">
                <ExperienceLevelSelector
                  value={workoutForm.experienceLevel}
                  onValueChange={workoutForm.setExperienceLevel}
                />
              </div>
              <div className="py-6">
                <DurationSelector
                  mode={mode}
                  value={workoutForm.desiredDuration}
                  onValueChange={workoutForm.setDesiredDuration}
                />
              </div>
              <div className="py-6">
                <BodyPartsSelector
                  selectedBodyParts={workoutForm.selectedBodyParts}
                  onToggle={workoutForm.handleBodyPartToggle}
                />
              </div>
              <div className="py-6">
                <EquipmentSelector
                  gymProfile={workoutForm.gymProfile}
                  onGymProfileChange={workoutForm.setGymProfile}
                  selectedEquipment={workoutForm.availableEquipment}
                  onEquipmentToggle={workoutForm.handleEquipmentToggle}
                />
              </div>
              <div className="pt-6">
                <AdditionalDetailsInput
                  mode={mode}
                  value={workoutForm.additionalDetails}
                  onChange={workoutForm.setAdditionalDetails}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-[8px] border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
                <p className="font-semibold">
                  Error generating {mode === "program" ? "program" : "workout"}
                </p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <SubmitButton
                mode={mode}
                loading={loading}
                canSubmit={workoutForm.canSubmit(mode)}
              />
              {mode === "workout" && !workoutForm.workoutType ? (
                <p className="text-center text-xs text-muted-foreground">
                  Select a workout split to continue
                </p>
              ) : null}
            </div>
          </form>
        ) : null}

        {workoutData ? (
          <WorkoutResults
            ref={resultsRef}
            workout={workoutData}
            onCopyFull={handleCopyFull}
            onCopyTemplate={handleCopyTemplate}
            copiedFull={copiedStates["full"] || false}
            copiedTemplate={copiedStates["template"] || false}
            onReset={resetGeneration}
          />
        ) : null}

        {programData ? (
          <ProgramResults
            ref={resultsRef}
            program={programData}
            onCopyFull={handleCopyFull}
            onCopyTemplate={handleCopyTemplate}
            copiedFull={copiedStates["full"] || false}
            copiedTemplate={copiedStates["template"] || false}
            onReset={resetGeneration}
          />
        ) : null}
      </div>
    </main>
  );
}
