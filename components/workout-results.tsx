import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ExerciseCard } from "@/components/exercise-card";
import type { WorkoutData } from "@/lib/workout-types";

interface WorkoutResultsProps {
  workout: WorkoutData;
  onCopyFull: () => void;
  onCopyTemplate: () => void;
  copiedFull: boolean;
  copiedTemplate: boolean;
}

export const WorkoutResults = forwardRef<HTMLDivElement, WorkoutResultsProps>(
  (
    { workout, onCopyFull, onCopyTemplate, copiedFull, copiedTemplate },
    ref,
  ) => {
    return (
      <div ref={ref} className="mt-6 sm:mt-8">
        {/* Header */}
        <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="mb-1 text-xl font-bold sm:text-2xl">
                Your Workout
              </h2>
              <p className="text-muted-foreground text-sm">
                Estimated Duration: {workout.estimatedDuration}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyFull}
                className="gap-2"
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
                className="gap-2"
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
            </div>
          </div>

          {/* General Notes */}
          {workout.notes && (
            <div className="bg-muted/50 mt-4 rounded-md p-3">
              <p className="text-muted-foreground text-sm">{workout.notes}</p>
            </div>
          )}
        </div>

        {/* Exercise Cards */}
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>
      </div>
    );
  },
);

WorkoutResults.displayName = "WorkoutResults";
