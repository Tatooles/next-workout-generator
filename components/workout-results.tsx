"use client";

import { forwardRef } from "react";
import { ExerciseCard } from "@/components/exercise-card";
import type { WorkoutData } from "@/lib/workout-types";

const CopyIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,7 5.5,10.5 12,3" />
  </svg>
);

interface WorkoutResultsProps {
  workout: WorkoutData;
  onCopyFull: () => void;
  copiedFull: boolean;
  onReset: () => void;
}

export const WorkoutResults = forwardRef<HTMLDivElement, WorkoutResultsProps>(
  ({ workout, onCopyFull, copiedFull, onReset }, ref) => {
    return (
      <div ref={ref}>
        {/* Header card */}
        <div className="animate-fade-up rounded-wg-lg border-border bg-card mb-3 border px-[22px] py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-wg-accent mb-[6px] text-[10px] font-bold tracking-[0.08em] uppercase">
                Generated Workout
              </div>
              <div className="text-foreground text-[22px] font-bold">
                Your Workout
              </div>
              <div className="text-muted-foreground mt-1 text-[13px]">
                Est. {workout.estimatedDuration}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Copy button */}
              <button
                type="button"
                onClick={onCopyFull}
                className={`rounded-wg-sm inline-flex cursor-pointer items-center gap-[6px] border bg-transparent px-[14px] py-2 text-[13px] leading-none font-medium transition-all duration-150 ${
                  copiedFull
                    ? "border-wg-accent text-wg-accent"
                    : "border-border text-muted-foreground"
                }`}
              >
                {copiedFull ? <CheckIcon /> : <CopyIcon />}
                {copiedFull ? "Copied" : "Copy"}
              </button>

              {/* New Workout button */}
              <button
                type="button"
                onClick={onReset}
                className="rounded-wg-sm border-border text-muted-foreground hover:border-ring hover:text-foreground inline-flex cursor-pointer items-center gap-[6px] border bg-transparent px-[14px] py-2 text-[13px] leading-none font-medium transition-all duration-150"
              >
                New Workout
              </button>
            </div>
          </div>

          {workout.notes && (
            <div className="rounded-wg-sm bg-muted text-muted-foreground mt-4 px-[14px] py-[11px] text-[13px] leading-[1.6]">
              {workout.notes}
            </div>
          )}
        </div>

        {/* Exercise cards */}
        <div className="flex flex-col gap-2">
          {workout.exercises.map((exercise, i) => (
            <ExerciseCard key={i} exercise={exercise} index={i} />
          ))}
        </div>
      </div>
    );
  },
);

WorkoutResults.displayName = "WorkoutResults";
