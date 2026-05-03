"use client";

import { useState } from "react";
import { ExerciseDetails } from "@/components/exercise-details";
import { ChevronIcon } from "@/components/result-icons";
import type { Exercise } from "@/lib/workout-types";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="animate-fade-up rounded-wg border-border bg-card hover:border-ring overflow-hidden border transition-colors duration-150">
      <div
        className="flex cursor-pointer items-center gap-[14px] px-5 py-4 select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="bg-wg-accent-sub text-wg-accent flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[7px] text-[13px] font-bold">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate text-[15px] leading-[1.2] font-semibold">
            {exercise.name}
          </div>
          <div className="text-muted-foreground mt-[3px] text-[11px]">
            {exercise.muscleGroups.slice(0, 3).join(" · ")}
          </div>
        </div>

        <div className="mr-1 flex-shrink-0 text-right">
          <div className="text-foreground text-[15px] font-bold">
            {exercise.sets}
            <span className="text-muted-foreground font-normal">×</span>
            {exercise.reps}
          </div>
          <div className="text-muted-foreground mt-[1px] text-[10px] tracking-[0.05em] uppercase">
            rest {exercise.restTime}
          </div>
        </div>

        <div className="text-ring flex-shrink-0">
          <ChevronIcon open={open} />
        </div>
      </div>

      {open && (
        <div className="animate-fade-up-sm border-border border-t px-5 py-4">
          <ExerciseDetails exercise={exercise} />
        </div>
      )}
    </div>
  );
}
