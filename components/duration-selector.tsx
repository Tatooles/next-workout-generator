import { ChipButton } from "@/components/ui/chip-button";
import type { GenerationMode } from "@/lib/generation-types";
import { workoutDurations, type WorkoutDuration } from "@/lib/workout-options";

interface DurationSelectorProps {
  mode: GenerationMode;
  value: WorkoutDuration | null;
  onValueChange: (value: WorkoutDuration | null) => void;
}

export function DurationSelector({
  mode,
  value,
  onValueChange,
}: DurationSelectorProps) {
  const isProgramMode = mode === "program";

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
        {isProgramMode
          ? "Workout Duration Per Session"
          : "Desired Workout Duration"}
      </p>
      <div className="flex flex-wrap gap-2">
        {workoutDurations.map((duration) => (
          <ChipButton
            key={duration}
            active={value === duration}
            onClick={() => onValueChange(value === duration ? null : duration)}
          >
            {duration.replace(" minutes", " min")}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}
