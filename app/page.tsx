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
  const { result, error, loading, submitGeneration, resetGeneration } =
    useGenerationSubmit();
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

    setMode(nextMode);
    resetGeneration();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await submitGeneration(e, mode, {
      bodyParts: workoutForm.selectedBodyParts,
      workoutType: workoutForm.workoutType,
      programSplit: workoutForm.programSplit,
      programTrainingDaysPerWeek: workoutForm.programTrainingDaysPerWeek,
      additionalDetails: workoutForm.additionalDetails || null,
      experienceLevel: workoutForm.experienceLevel,
      desiredDuration: workoutForm.desiredDuration,
      gymProfile: workoutForm.gymProfile,
      availableEquipment: workoutForm.availableEquipment,
      model: workoutForm.model,
    });
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <WorkoutHeader
          mode={mode}
          onModeChange={handleModeChange}
          model={workoutForm.model}
          onModelChange={workoutForm.setModel}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <SplitWorkoutSelector
              mode={mode}
              workoutType={workoutForm.workoutType}
              programSplit={workoutForm.programSplit}
              onWorkoutTypeChange={workoutForm.setWorkoutType}
              onProgramSplitChange={workoutForm.setProgramSplit}
            />
            {mode === "program" ? (
              <ProgramDaysPerWeekSelector
                value={workoutForm.programTrainingDaysPerWeek}
                programSplit={workoutForm.programSplit}
                onValueChange={workoutForm.setProgramTrainingDaysPerWeek}
              />
            ) : null}
            <ExperienceLevelSelector
              value={workoutForm.experienceLevel}
              onValueChange={workoutForm.setExperienceLevel}
            />
            <DurationSelector
              mode={mode}
              value={workoutForm.desiredDuration}
              onValueChange={workoutForm.setDesiredDuration}
            />
            <BodyPartsSelector
              selectedBodyParts={workoutForm.selectedBodyParts}
              onToggle={workoutForm.handleBodyPartToggle}
            />
            <EquipmentSelector
              gymProfile={workoutForm.gymProfile}
              onGymProfileChange={workoutForm.setGymProfile}
              selectedEquipment={workoutForm.availableEquipment}
              onEquipmentToggle={workoutForm.handleEquipmentToggle}
            />
          </div>

          <AdditionalDetailsInput
            mode={mode}
            value={workoutForm.additionalDetails}
            onChange={workoutForm.setAdditionalDetails}
          />

          <SubmitButton
            mode={mode}
            loading={loading}
            canSubmit={workoutForm.canSubmit}
          />
        </form>

        {workoutData && (
          <WorkoutResults
            ref={resultsRef}
            workout={workoutData}
            onCopyFull={handleCopyFull}
            onCopyTemplate={handleCopyTemplate}
            copiedFull={copiedStates["full"] || false}
            copiedTemplate={copiedStates["template"] || false}
          />
        )}

        {programData && (
          <ProgramResults
            ref={resultsRef}
            program={programData}
            onCopyFull={handleCopyFull}
            onCopyTemplate={handleCopyTemplate}
            copiedFull={copiedStates["full"] || false}
            copiedTemplate={copiedStates["template"] || false}
          />
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive animate-in fade-in slide-in-from-bottom-4 border-destructive/20 mt-6 rounded-lg border p-4 duration-500 sm:mt-8 sm:p-6">
            <p className="mb-1 font-semibold">
              Error generating {mode === "program" ? "program" : "workout"}
            </p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
