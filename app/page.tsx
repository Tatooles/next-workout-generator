"use client";

import { useEffect, useRef, useState } from "react";
import { WorkoutHeader } from "@/components/workout-header";
import { SplitWorkoutSelector } from "@/components/split-workout-selector";
import { ExperienceLevelSelector } from "@/components/experience-level-selector";
import { DurationSelector } from "@/components/duration-selector";
import { BodyPartsSelector } from "@/components/body-parts-selector";
import { EquipmentSelector } from "@/components/equipment-selector";
import { AdditionalDetailsInput } from "@/components/additional-details-input";
import { SubmitButton } from "@/components/submit-button";
import { WorkoutResults } from "@/components/workout-results";
import { ProgramResults } from "@/components/program-results";
import { ProgramGoalSelector } from "@/components/program-goal-selector";
import { ProgramSplitSelector } from "@/components/program-split-selector";
import { ProgramDaysPerWeekSelector } from "@/components/program-days-per-week-selector";
import { ModelSelector } from "@/components/model-selector";
import {
  FONT_OPTIONS,
  TweaksPanel,
  TWEAKS_DEFAULTS,
  isFontFamily,
  type TweaksState,
} from "@/components/settings-menu";
import type { GenerationMode } from "@/lib/generation-types";
import { useGenerationSubmit } from "@/lib/hooks/use-generation-submit";
import { useWorkoutForm } from "@/lib/hooks/use-workout-form";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { formatWorkoutAsText, formatProgramAsText } from "@/lib/utils";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

const isJsonObject = (value: JsonValue): value is JsonObject =>
  typeof value === "object" && value !== null;

const isValidAccent = (value: JsonValue | undefined): value is string => {
  if (typeof value !== "string") return false;
  const [lightness, chroma, hue] = value.split(" ");
  return (
    Number.isFinite(Number(lightness)) &&
    Number.isFinite(Number(chroma)) &&
    Number.isFinite(Number(hue))
  );
};

const isValidRadius = (value: JsonValue | undefined): value is string => {
  if (typeof value !== "string") return false;

  const trimmedValue = value.trim();
  if (!/^\d+$/.test(trimmedValue)) return false;

  const radius = Number.parseInt(trimmedValue, 10);
  return radius >= 0 && radius <= 32;
};

const getStoredTweaks = (): string | null => {
  try {
    return localStorage.getItem("wg_tweaks");
  } catch {
    return null;
  }
};

const parseStoredTweaks = (value: string | null): TweaksState => {
  if (!value) return TWEAKS_DEFAULTS;

  try {
    const parsed: JsonValue = JSON.parse(value);
    if (!isJsonObject(parsed)) return TWEAKS_DEFAULTS;

    return {
      accentOklch: isValidAccent(parsed.accentOklch)
        ? parsed.accentOklch
        : TWEAKS_DEFAULTS.accentOklch,
      fontFamily:
        typeof parsed.fontFamily === "string" && isFontFamily(parsed.fontFamily)
          ? parsed.fontFamily
          : TWEAKS_DEFAULTS.fontFamily,
      cardRadius: isValidRadius(parsed.cardRadius)
        ? parsed.cardRadius.trim()
        : TWEAKS_DEFAULTS.cardRadius,
    };
  } catch {
    return TWEAKS_DEFAULTS;
  }
};

const normalizeTweaks = (value: TweaksState): TweaksState => ({
  accentOklch: isValidAccent(value.accentOklch)
    ? value.accentOklch
    : TWEAKS_DEFAULTS.accentOklch,
  fontFamily: isFontFamily(value.fontFamily)
    ? value.fontFamily
    : TWEAKS_DEFAULTS.fontFamily,
  cardRadius: isValidRadius(value.cardRadius)
    ? value.cardRadius.trim()
    : TWEAKS_DEFAULTS.cardRadius,
});

const BarbellIcon = ({ size = 44 }: { size?: number }) => (
  <svg
    width={size}
    height={Math.round(size * 0.5)}
    viewBox="0 0 48 24"
    fill="currentColor"
  >
    <rect x="0" y="6" width="5" height="12" rx="2" />
    <rect x="5" y="3" width="3" height="18" rx="1.5" />
    <rect x="8" y="10" width="32" height="4" rx="2" />
    <rect x="40" y="3" width="3" height="18" rx="1.5" />
    <rect x="43" y="6" width="5" height="12" rx="2" />
  </svg>
);

function LoadingState({ mode }: { mode: GenerationMode }) {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-[18px] px-5 py-[72px]">
      <div className="animate-pulse-barbell text-wg-accent">
        <BarbellIcon size={44} />
      </div>
      <div className="text-center">
        <div className="text-foreground mb-[6px] text-[16px] font-semibold">
          Building your {mode}…
        </div>
        <div className="text-muted-foreground text-[13px]">
          Analyzing your inputs
        </div>
      </div>
    </div>
  );
}

function SharedWorkoutFields({
  mode,
  workoutForm,
}: {
  mode: GenerationMode;
  workoutForm: ReturnType<typeof useWorkoutForm>;
}) {
  return (
    <>
      <ExperienceLevelSelector
        value={workoutForm.experienceLevel}
        onValueChange={workoutForm.setExperienceLevel}
      />
      <DurationSelector
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
      <AdditionalDetailsInput
        mode={mode}
        value={workoutForm.additionalDetails}
        onChange={workoutForm.setAdditionalDetails}
      />
    </>
  );
}

export default function Home() {
  const [mode, setMode] = useState<GenerationMode>("workout");
  const [showTweaks, setShowTweaks] = useState(false);
  const [tweaks, setTweaks] = useState<TweaksState>(() => {
    if (typeof window === "undefined") return TWEAKS_DEFAULTS;
    return parseStoredTweaks(getStoredTweaks());
  });

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
    const safeTweaks = normalizeTweaks(tweaks);
    const root = document.documentElement.style;
    const parts = safeTweaks.accentOklch.split(" ");
    const l = parseFloat(parts[0]);
    const rest = parts.slice(1).join(" ");
    const hoverL = Math.min(l + 0.07, 0.99).toFixed(2);

    root.setProperty("--wg-accent", `oklch(${safeTweaks.accentOklch})`);
    root.setProperty("--wg-accent-h", `oklch(${hoverL} ${rest})`);
    root.setProperty(
      "--wg-accent-sub",
      `oklch(${safeTweaks.accentOklch} / 0.12)`,
    );
    root.setProperty(
      "--wg-accent-sub-h",
      `oklch(${safeTweaks.accentOklch} / 0.20)`,
    );

    const fontMap: Record<(typeof FONT_OPTIONS)[number], string> = {
      "Space Grotesk": "var(--font-space-grotesk), sans-serif",
      "DM Sans": "var(--font-dm-sans), sans-serif",
      "Helvetica Neue": "'Helvetica Neue', Helvetica, Arial, sans-serif",
    };
    root.setProperty("--wg-font", fontMap[safeTweaks.fontFamily]);

    const r = parseInt(safeTweaks.cardRadius, 10);
    root.setProperty("--wg-radius", `${r}px`);
    root.setProperty("--wg-radius-sm", `${Math.max(4, r - 2)}px`);
    root.setProperty("--wg-radius-lg", `${Math.max(10, r + 6)}px`);

    try {
      localStorage.setItem("wg_tweaks", JSON.stringify(safeTweaks));
    } catch {}
  }, [tweaks]);

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

  const handleTweakUpdate = <K extends keyof TweaksState>(
    key: K,
    value: TweaksState[K],
  ) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    cancelGeneration();
    resetGeneration();
  };

  const handleModeChange = (nextMode: GenerationMode) => {
    if (nextMode === mode) return;
    handleReset();
    setMode(nextMode);
  };

  const handleCopy = () => {
    if (workoutData) {
      copyToClipboard(formatWorkoutAsText(workoutData), "full");
    } else if (programData) {
      copyToClipboard(formatProgramAsText(programData), "full");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitGeneration(mode, workoutForm.getGenerationParams(mode));
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-[680px] px-5 pt-9 pb-[100px]">
        <WorkoutHeader
          mode={mode}
          onModeChange={handleModeChange}
          onToggleTweaks={() => setShowTweaks((s) => !s)}
        />

        {loading ? (
          <LoadingState mode={mode} />
        ) : workoutData ? (
          <div ref={resultsRef}>
            <WorkoutResults
              workout={workoutData}
              onCopyFull={handleCopy}
              copiedFull={copiedStates["full"] || false}
              onReset={handleReset}
            />
          </div>
        ) : programData ? (
          <div ref={resultsRef}>
            <ProgramResults
              program={programData}
              onCopyFull={handleCopy}
              copiedFull={copiedStates["full"] || false}
              onReset={handleReset}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {mode === "workout" && (
              <>
                <SplitWorkoutSelector
                  workoutType={workoutForm.workoutType}
                  onWorkoutTypeChange={workoutForm.setWorkoutType}
                />
                <SharedWorkoutFields mode={mode} workoutForm={workoutForm} />
              </>
            )}

            {mode === "program" && (
              <>
                <ProgramSplitSelector
                  value={workoutForm.programSplit}
                  onValueChange={workoutForm.setProgramSplit}
                />
                <ProgramGoalSelector
                  value={workoutForm.programGoal}
                  onValueChange={workoutForm.setProgramGoal}
                />
                <ProgramDaysPerWeekSelector
                  value={workoutForm.programTrainingDaysPerWeek}
                  programSplit={workoutForm.programSplit}
                  onValueChange={workoutForm.setProgramTrainingDaysPerWeek}
                />
                <SharedWorkoutFields mode={mode} workoutForm={workoutForm} />
              </>
            )}

            <ModelSelector
              value={workoutForm.model}
              onValueChange={workoutForm.setModel}
            />

            {error && (
              <div className="rounded-wg border-error-sub bg-error-sub text-wg-accent mt-1 mb-2 border px-4 py-3 text-[13px]">
                {error}
              </div>
            )}

            <div className="mt-8">
              <SubmitButton
                mode={mode}
                loading={loading}
                canSubmit={workoutForm.canSubmit(mode)}
              />
            </div>
          </form>
        )}

        {showTweaks && (
          <TweaksPanel
            tweaks={tweaks}
            onUpdate={handleTweakUpdate}
            onClose={() => setShowTweaks(false)}
          />
        )}
      </div>
    </main>
  );
}
