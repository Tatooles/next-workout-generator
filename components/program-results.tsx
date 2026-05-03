"use client";

import { forwardRef, useState } from "react";
import { ExerciseDetails } from "@/components/exercise-details";
import { CheckIcon, ChevronIcon, CopyIcon } from "@/components/result-icons";
import { cn } from "@/lib/utils";
import type { ProgramData, ProgramDay } from "@/lib/workout-types";

function ProgramDayCard({
  day,
  dayNumber,
  isOpen,
  onToggle,
}: {
  day: ProgramDay;
  dayNumber: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="animate-fade-up rounded-wg border-border bg-card overflow-hidden border">
      <button
        type="button"
        aria-expanded={isOpen}
        className="focus-visible:outline-wg-accent flex w-full cursor-pointer items-center gap-[14px] bg-transparent px-5 py-4 text-left select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
        onClick={onToggle}
      >
        <div className="bg-wg-accent-sub text-wg-accent flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[7px] text-[11px] font-bold tracking-[0.02em]">
          D{dayNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-foreground text-[14px] font-semibold">
            {day.day} — {day.title}
          </div>
          <div className="mt-[2px] flex flex-col gap-x-2 gap-y-[2px] text-[12px] text-zinc-400 sm:flex-row sm:flex-wrap sm:items-center">
            {day.focus && <span>{day.focus}</span>}
            {day.focus && (
              <span className="hidden sm:inline" aria-hidden="true">
                |
              </span>
            )}
            <span>Est. {day.estimatedDuration}</span>
          </div>
        </div>
        <div className="text-ring flex-shrink-0">
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div className="animate-fade-up-sm border-border border-t px-5 py-[14px]">
          {day.exercises.map((ex, j) => {
            const musclePreview = ex.muscleGroups.slice(0, 3).join(", ");

            return (
              <div
                key={j}
                className={cn(
                  "py-4",
                  j < day.exercises.length - 1 && "border-border border-b",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="w-4 flex-shrink-0 pt-[3px] text-[11px] text-zinc-400">
                    {j + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <div className="text-foreground text-[14px] leading-[1.35] font-medium">
                          {ex.name}
                        </div>
                        {musclePreview && (
                          <div className="mt-[3px] text-[12px] leading-[1.45] text-zinc-400">
                            {musclePreview}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-medium text-zinc-400 sm:flex-shrink-0 sm:justify-end sm:text-right">
                        <span>
                          {ex.sets} x {ex.reps}
                        </span>
                        <span>rest {ex.restTime}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ExerciseDetails exercise={ex} compact />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {day.notes && (
            <div className="rounded-wg-sm bg-muted mt-3 px-3 py-2 text-[12px] leading-[1.5] text-zinc-400">
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProgramResultsProps {
  program: ProgramData;
  onCopyFull: () => void;
  copiedFull: boolean;
  onReset: () => void;
}

export const ProgramResults = forwardRef<HTMLDivElement, ProgramResultsProps>(
  ({ program, onCopyFull, copiedFull, onReset }, ref) => {
    const [openDay, setOpenDay] = useState(0);

    return (
      <div ref={ref}>
        <div className="animate-fade-up rounded-wg-lg border-border bg-card mb-3 border px-[22px] py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-wg-accent mb-[6px] text-[10px] font-bold tracking-[0.08em] uppercase">
                Generated Program
              </div>
              <div className="text-foreground text-[22px] font-bold">
                Your Program
              </div>
              <div className="mt-1 max-w-[420px] text-[13px] leading-[1.6] text-zinc-400">
                {program.weeklyOverview ||
                  `${program.days.length}-day training program`}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyFull}
                className={`rounded-wg-sm inline-flex cursor-pointer items-center gap-[6px] border px-[14px] py-2 text-[13px] leading-none font-medium transition-all duration-150 ${
                  copiedFull
                    ? "border-wg-accent text-wg-accent"
                    : "border-border text-zinc-400"
                }`}
              >
                {copiedFull ? <CheckIcon /> : <CopyIcon />}
                {copiedFull ? "Copied" : "Copy"}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="rounded-wg-sm border-border hover:border-ring hover:text-foreground inline-flex cursor-pointer items-center border bg-transparent px-[14px] py-2 text-[13px] leading-none font-medium text-zinc-400 transition-all duration-150"
              >
                New Program
              </button>
            </div>
          </div>
        </div>

        <div className="mb-[10px] text-[10px] font-bold tracking-[0.08em] text-zinc-400 uppercase">
          Week 1 Schedule
        </div>

        <div className="flex flex-col gap-2">
          {program.days.map((day, i) => (
            <ProgramDayCard
              key={day.day}
              day={day}
              dayNumber={i + 1}
              isOpen={openDay === i}
              onToggle={() => setOpenDay(openDay === i ? -1 : i)}
            />
          ))}
        </div>

        {program.progressionNotes && (
          <div className="rounded-wg border-border bg-card mt-4 border px-[14px] py-3 text-[13px] leading-[1.6] text-zinc-400">
            <div className="mb-[7px] text-[10px] font-bold tracking-[0.08em] text-zinc-400 uppercase">
              Progression Plan
            </div>
            <div>{program.progressionNotes}</div>
          </div>
        )}
      </div>
    );
  },
);

ProgramResults.displayName = "ProgramResults";
