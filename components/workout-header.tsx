"use client";

import type { GenerationMode } from "@/lib/generation-types";
import { cn } from "@/lib/utils";

const BarbellIcon = ({ size = 26 }: { size?: number }) => (
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

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

interface WorkoutHeaderProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  onToggleTweaks: () => void;
}

export function WorkoutHeader({
  mode,
  onModeChange,
  onToggleTweaks,
}: WorkoutHeaderProps) {
  return (
    <div className="mb-8">
      {/* Top bar: logo + settings */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-[14px]">
          <div className="bg-wg-accent-sub text-wg-accent flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-[11px]">
            <BarbellIcon size={26} />
          </div>
          <div>
            <h1 className="text-foreground text-2xl leading-[1.1] font-bold">
              Workout Generator
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              AI-powered personalized workouts &amp; weekly programs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTweaks}
          title="Tweaks"
          className="border-border text-muted-foreground hover:border-ring hover:text-foreground flex cursor-pointer items-center justify-center rounded-[8px] border bg-transparent p-2 transition-all duration-150"
        >
          <SettingsIcon />
        </button>
      </div>

      {/* Mode toggle pill */}
      <div className="border-border bg-card inline-flex gap-[2px] rounded-[11px] border p-1">
        {(["workout", "program"] as GenerationMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              "cursor-pointer rounded-[7px] border-none px-[22px] py-[7px] text-[13px] transition-all duration-150",
              mode === m
                ? "bg-secondary text-foreground font-semibold"
                : "text-muted-foreground bg-transparent font-medium",
            )}
          >
            {m === "workout" ? "Workout" : "Program"}
          </button>
        ))}
      </div>
    </div>
  );
}
