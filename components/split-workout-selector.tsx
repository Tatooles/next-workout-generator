import { ChipGroup, FormSection } from "@/components/chip";
import { workoutTypes, type WorkoutType } from "@/lib/workout-options";

const SPLIT_LABELS: Record<WorkoutType, string> = {
  "Leg Workout": "Legs",
  "Push Workout": "Push",
  "Pull Workout": "Pull",
  "Upper Body Workout": "Upper Body",
  "Lower Body Workout": "Lower Body",
  "Full Body Workout": "Full Body",
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
      <ChipGroup
        options={workoutTypes}
        value={workoutType}
        onValueChange={onWorkoutTypeChange}
        getLabel={(type) => SPLIT_LABELS[type]}
        className="grid grid-cols-3 gap-2"
      />
    </FormSection>
  );
}
