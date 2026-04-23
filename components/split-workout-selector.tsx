import { Chip, FormSection } from "@/components/chip";
import { workoutTypes, type WorkoutType } from "@/lib/workout-options";

const SPLIT_LABELS: Record<WorkoutType, string> = {
  "Leg Workout":        "Legs",
  "Push Workout":       "Push",
  "Pull Workout":       "Pull",
  "Upper Body Workout": "Upper Body",
  "Lower Body Workout": "Lower Body",
  "Full Body Workout":  "Full Body",
};

interface SplitWorkoutSelectorProps {
  workoutType: WorkoutType | null;
  onWorkoutTypeChange: (value: WorkoutType | null) => void;
}

export function SplitWorkoutSelector({
  workoutType,
  onWorkoutTypeChange,
}: SplitWorkoutSelectorProps) {
  return (
    <FormSection label="Workout Split" first>
      <div className="grid grid-cols-3 gap-2">
        {workoutTypes.map((type) => (
          <Chip
            key={type}
            label={SPLIT_LABELS[type]}
            active={workoutType === type}
            onClick={() =>
              onWorkoutTypeChange(workoutType === type ? null : type)
            }
          />
        ))}
      </div>
    </FormSection>
  );
}
