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
import { WorkoutType } from "@/lib/muscle-groups";

interface SplitWorkoutSelectorProps {
  workoutType: WorkoutType | null;
  onWorkoutTypeChange: (value: WorkoutType) => void;
}

export function SplitWorkoutSelector({
  workoutType,
  onWorkoutTypeChange,
}: SplitWorkoutSelectorProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="workout-split-select" className="text-sm font-medium">
        Workout Split
      </Label>
      <Select
        value={workoutType || ""}
        onValueChange={(value) => onWorkoutTypeChange(value as WorkoutType)}
      >
        <SelectTrigger id="workout-split-select" className="w-full">
          <SelectValue placeholder="Choose a workout split..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Push Pull Legs Split</SelectLabel>
            <SelectItem value="leg workout">Leg Workout</SelectItem>
            <SelectItem value="push workout">Push Workout</SelectItem>
            <SelectItem value="pull workout">Pull Workout</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Upper/Lower Split</SelectLabel>
            <SelectItem value="upper body workout">
              Upper Body Workout
            </SelectItem>
            <SelectItem value="lower body workout">
              Lower Body Workout
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="full body workout">Full Body Workout</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
