import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenerationMode } from "@/lib/generation-types";
import {
  type ProgramSplit,
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

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="workout-split-select" className="text-sm font-medium">
          {isProgramMode ? "Program Split" : "Workout Split"}
        </Label>
        {isProgramMode ? (
          <p className="text-muted-foreground text-xs">
            This sets the primary weekly structure the program should build
            around.
          </p>
        ) : null}
      </div>
      <Select
        value={isProgramMode ? (programSplit ?? "") : (workoutType ?? "")}
        onValueChange={(value) =>
          isProgramMode
            ? onProgramSplitChange(value as ProgramSplit)
            : onWorkoutTypeChange(value as WorkoutType)
        }
      >
        <SelectTrigger id="workout-split-select" className="w-full">
          <SelectValue
            placeholder={
              isProgramMode
                ? "Choose a program split..."
                : "Choose a workout split..."
            }
          />
        </SelectTrigger>
        <SelectContent>
          {isProgramMode ? (
            <>
              <SelectGroup>
                <SelectLabel>Classic Splits</SelectLabel>
                <SelectItem value="Push/Pull/Legs">Push/Pull/Legs</SelectItem>
                <SelectItem value="Upper/Lower">Upper/Lower</SelectItem>
                <SelectItem value="Full Body">Full Body</SelectItem>
                <SelectItem value="Body Part Split">
                  Body Part Split
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Popular Hybrids</SelectLabel>
                <SelectItem value="Arnold Split">Arnold Split</SelectItem>
                <SelectItem value="Powerbuilding">Powerbuilding</SelectItem>
                <SelectItem value="Strength + Conditioning">
                  Strength + Conditioning
                </SelectItem>
              </SelectGroup>
            </>
          ) : (
            <>
              <SelectGroup>
                <SelectLabel>Push Pull Legs Split</SelectLabel>
                <SelectItem value="Leg Workout">Leg Workout</SelectItem>
                <SelectItem value="Push Workout">Push Workout</SelectItem>
                <SelectItem value="Pull Workout">Pull Workout</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Upper/Lower Split</SelectLabel>
                <SelectItem value="Upper Body Workout">
                  Upper Body Workout
                </SelectItem>
                <SelectItem value="Lower Body Workout">
                  Lower Body Workout
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Other</SelectLabel>
                <SelectItem value="Full Body Workout">
                  Full Body Workout
                </SelectItem>
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
