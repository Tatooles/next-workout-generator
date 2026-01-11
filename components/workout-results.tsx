import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import type { WorkoutData } from "@/lib/workout-types";

interface WorkoutResultsProps {
  workout: WorkoutData;
  onCopy: () => void;
  copied: boolean;
}

interface ExerciseCardProps {
  exercise: WorkoutData["exercises"][0];
  index: number;
}

function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      {/* Exercise Header */}
      <h3 className="mb-2 text-lg font-semibold">
        {index + 1}. {exercise.name}
      </h3>

      {/* Exercise Stats */}
      <div className="text-muted-foreground mb-3 flex gap-4 text-sm">
        <span>
          <strong>Sets:</strong> {exercise.sets}
        </span>
        <span>
          <strong>Reps:</strong> {exercise.reps}
        </span>
        <span>
          <strong>Rest:</strong> {exercise.restTime}
        </span>
      </div>

      {/* Muscle Groups */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {exercise.muscleGroups.map((muscle, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {muscle}
          </Badge>
        ))}
      </div>

      {/* Form Tips */}
      <div className="mt-3">
        <p className="mb-1.5 text-sm font-medium">Form Tips:</p>
        <ul className="text-muted-foreground space-y-1 text-sm">
          {exercise.formTips.map((tip, idx) => (
            <li key={idx}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const WorkoutResults = forwardRef<HTMLDivElement, WorkoutResultsProps>(
  ({ workout, onCopy, copied }, ref) => {
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
                Duration: {workout.estimatedDuration}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
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
