"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Exercise } from "@/lib/workout-types";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <article className="panel-surface overflow-hidden transition-colors hover:border-[#2e2e2e]">
      <button
        type="button"
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-primary/12 text-sm font-bold text-primary">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold">{exercise.name}</h3>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            {exercise.muscleGroups.slice(0, 3).join(" · ")}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[15px] font-bold tracking-[-0.01em]">
            {exercise.sets}
            <span className="mx-0.5 font-normal text-muted-foreground">×</span>
            {exercise.reps}
          </p>
          <p className="mt-0.5 text-[10px] font-medium tracking-[0.05em] text-muted-foreground uppercase">
            Rest {exercise.restTime}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#444] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="border-t border-border px-5 py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="rounded-[6px] bg-secondary px-4 py-2 text-center">
              <p className="text-lg font-bold">{exercise.sets}</p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                Sets
              </p>
            </div>
            <div className="rounded-[6px] bg-secondary px-4 py-2 text-center">
              <p className="text-lg font-bold">{exercise.reps}</p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                Reps
              </p>
            </div>
            <div className="rounded-[6px] bg-secondary px-4 py-2 text-center">
              <p className="text-lg font-bold">{exercise.restTime}</p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                Rest
              </p>
            </div>
          </div>

          {exercise.muscleGroups.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {exercise.muscleGroups.map((muscle) => (
                <span
                  key={`${exercise.name}-${muscle}`}
                  className="rounded-[4px] bg-primary/12 px-2.5 py-1 text-[11px] font-semibold tracking-[0.03em] text-primary"
                >
                  {muscle}
                </span>
              ))}
            </div>
          ) : null}

          {exercise.formTips.length > 0 ? (
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                Form Tips
              </p>
              <ul className="space-y-2 text-[13px] leading-6 text-muted-foreground">
                {exercise.formTips.map((tip, idx) => (
                  <li key={`${exercise.name}-tip-${idx}`} className="flex gap-3">
                    <span className="text-primary">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
