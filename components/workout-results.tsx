"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RotateCcw } from "lucide-react";
import { ExerciseCard } from "@/components/exercise-card";
import type { WorkoutData } from "@/lib/workout-types";

interface WorkoutResultsProps {
  workout: WorkoutData;
  onCopyFull: () => void;
  onCopyTemplate: () => void;
  copiedFull: boolean;
  copiedTemplate: boolean;
  onReset: () => void;
}

export const WorkoutResults = forwardRef<HTMLDivElement, WorkoutResultsProps>(
  (
    {
      workout,
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
                Generated Workout
              </p>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                Your Workout
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Est. {workout.estimatedDuration}
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
                    Copy Workout
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
                New Workout
              </Button>
            </div>
          </div>

          {workout.notes && (
            <div className="mt-4 rounded-md bg-secondary px-4 py-3">
              <p className="text-muted-foreground text-sm leading-6">
                {workout.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>
      </div>
    );
  },
);

WorkoutResults.displayName = "WorkoutResults";
