import { ChipButton } from "@/components/ui/chip-button";
import type { GenerationMode } from "@/lib/generation-types";
import {
  programSplits,
  type ProgramSplit,
  workoutTypes,
  type WorkoutType,
} from "@/lib/workout-options";

interface SplitWorkoutSelectorProps {
  mode: GenerationMode;
  workoutType: WorkoutType | null;
  programSplit: ProgramSplit | null;
  onWorkoutTypeChange: (value: WorkoutType) => void;
  onProgramSplitChange: (value: ProgramSplit) => void;
}

export function SplitWorkoutSelector({
  mode,
  workoutType,
  programSplit,
  onWorkoutTypeChange,
  onProgramSplitChange,
}: SplitWorkoutSelectorProps) {
  const isProgramMode = mode === "program";
  const options = isProgramMode ? programSplits : workoutTypes;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
          {isProgramMode ? "Program Split" : "Workout Split"}
        </p>
        <p className="text-muted-foreground text-xs">
          {isProgramMode
            ? "Select the primary weekly structure the program should build around."
            : "Choose the lifting split this workout should target."}
        </p>
      </div>

      <div
        className={
          isProgramMode
            ? "grid gap-2 sm:grid-cols-2"
            : "grid gap-2 sm:grid-cols-3"
        }
      >
        {options.map((option) => {
          const active = isProgramMode
            ? programSplit === option
            : workoutType === option;

          return (
            <ChipButton
              key={option}
              active={active}
              className="justify-center"
              onClick={() => {
                if (isProgramMode) {
                  onProgramSplitChange(option as ProgramSplit);
                  return;
                }

                onWorkoutTypeChange(option as WorkoutType);
              }}
            >
              {isProgramMode
                ? option
                : option
                    .replace(" Workout", "")
                    .replace("Lower Body", "Lower Body")
                    .replace("Upper Body", "Upper Body")}
            </ChipButton>
          );
        })}
      </div>
    </div>
  );
}
