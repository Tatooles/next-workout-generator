import { Chip, FormSection } from "@/components/chip";
import { workoutDurations, type WorkoutDuration } from "@/lib/workout-options";

const DURATION_LABELS: Record<WorkoutDuration, string> = {
  "15 minutes":   "15 min",
  "30 minutes":   "30 min",
  "45 minutes":   "45 min",
  "60 minutes":   "60 min",
  "75+ minutes":  "75+ min",
};

interface DurationSelectorProps {
  value: WorkoutDuration | null;
  onValueChange: (value: WorkoutDuration | null) => void;
}

export function DurationSelector({ value, onValueChange }: DurationSelectorProps) {
  return (
    <FormSection label="Duration">
      <div className="flex flex-wrap gap-2">
        {workoutDurations.map((d) => (
          <Chip
            key={d}
            label={DURATION_LABELS[d]}
            active={value === d}
            onClick={() => onValueChange(value === d ? null : d)}
          />
        ))}
      </div>
    </FormSection>
  );
}
