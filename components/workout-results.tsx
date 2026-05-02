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
        <div
          className="border rounded-[var(--wg-radius-lg)] px-[22px] py-5 mb-3 animate-fade-up"
          style={{ background: "#111111", borderColor: "#232323" }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[6px]"
                style={{ color: "var(--wg-accent)" }}
              >
                Generated Workout
              </div>
              <div
                className="text-[22px] font-bold tracking-[-0.02em]"
                style={{ color: "#edeae6" }}
              >
                Your Workout
              </div>
              <div className="text-[13px] mt-1" style={{ color: "#555" }}>
                Est. {workout.estimatedDuration}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Copy button */}
              <button
                type="button"
                onClick={onCopyFull}
                className="inline-flex items-center gap-[6px] px-[14px] py-2 text-[13px] font-medium rounded-[var(--wg-radius-sm)] border transition-all duration-150 cursor-pointer leading-none"
                style={{
                  background: "transparent",
                  borderColor: copiedFull ? "var(--wg-accent)" : "#232323",
                  color: copiedFull ? "var(--wg-accent)" : "#555",
                }}
              >
                {copiedFull ? <CheckIcon /> : <CopyIcon />}
                {copiedFull ? "Copied" : "Copy"}
              </button>

              {/* New Workout button */}
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-[6px] px-[14px] py-2 text-[13px] font-medium rounded-[var(--wg-radius-sm)] border border-[#232323] transition-all duration-150 cursor-pointer leading-none hover:border-[#2e2e2e] hover:text-[#edeae6]"
                style={{ background: "transparent", color: "#555" }}
              >
                New Workout
              </button>
            </div>
          </div>

          {workout.notes && (
            <div
              className="mt-4 px-[14px] py-[11px] rounded-[var(--wg-radius-sm)] text-[13px] leading-[1.6]"
              style={{ background: "#181818", color: "#555" }}
            >
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
