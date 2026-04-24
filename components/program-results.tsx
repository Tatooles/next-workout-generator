"use client";

import { forwardRef, useState } from "react";
import { Check, ChevronDown, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProgramData, ProgramDay } from "@/lib/workout-types";

interface ProgramResultsProps {
  program: ProgramData;
  onCopyFull: () => void;
  onCopyTemplate: () => void;
  copiedFull: boolean;
  copiedTemplate: boolean;
  onReset: () => void;
}

function ProgramDayCard({ day }: { day: ProgramDay }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="panel-surface overflow-hidden">
      <button
        type="button"
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-primary/12 text-[11px] font-bold tracking-[0.02em] text-primary">
          {day.day.slice(0, 3).toUpperCase()}
        </div>
        <div>
          <p className="text-[14px] font-semibold">{day.title}</p>
          {day.focus ? (
            <p className="text-muted-foreground mt-1 text-sm">{day.focus}</p>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            {day.estimatedDuration}
          </p>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#444] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {day.notes ? (
        <div className="border-t border-border px-5 py-3">
          <p className="text-muted-foreground text-sm">{day.notes}</p>
        </div>
      ) : null}

      {open ? (
        <div className="border-t border-border px-5 py-3">
          {day.exercises.map((exercise, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-3 ${
                index < day.exercises.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="w-4 shrink-0 text-[11px] text-[#444]">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-medium">{exercise.name}</span>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {exercise.sets}×{exercise.reps}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export const ProgramResults = forwardRef<HTMLDivElement, ProgramResultsProps>(
  (
    {
      program,
      onCopyFull,
      onCopyTemplate,
      copiedFull,
      copiedTemplate,
      onReset,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className="space-y-3">
        <div className="panel-surface rounded-[14px] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.08em] text-primary uppercase">
                Generated Program
              </p>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                Your Program
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {program.days.length}-day training program
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyFull}
                className="h-9 rounded-md border-border bg-transparent px-3 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
              >
                {copiedFull ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Program
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyTemplate}
                className="h-9 rounded-md border-border bg-transparent px-3 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Template
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="h-9 rounded-md border-border bg-transparent px-3 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                New Program
              </Button>
            </div>
          </div>

          {program.weeklyOverview ? (
            <div className="mt-4 rounded-md bg-secondary px-4 py-3">
              <p className="text-muted-foreground text-sm leading-6">
                {program.weeklyOverview}
              </p>
            </div>
          ) : null}

          {program.weeklyNotes ? (
            <div className="mt-3 rounded-md border border-border bg-secondary/40 px-4 py-3">
              <p className="text-muted-foreground text-sm leading-6">
                {program.weeklyNotes}
              </p>
            </div>
          ) : null}
        </div>

        <p className="text-muted-foreground text-[10px] font-bold tracking-[0.08em] uppercase">
          Week 1 — Sample Schedule
        </p>

        {program.days.map((day) => (
          <ProgramDayCard key={day.day} day={day} />
        ))}
      </div>
    );
  },
);

ProgramResults.displayName = "ProgramResults";
