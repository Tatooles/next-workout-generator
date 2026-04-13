import { Badge } from "@/components/ui/badge";
import type { Exercise } from "@/lib/workout-types";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        {index + 1}. {exercise.name}
      </h3>

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

      <div className="mb-3 flex flex-wrap gap-1.5">
        {exercise.muscleGroups.map((muscle, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {muscle}
          </Badge>
        ))}
      </div>

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
