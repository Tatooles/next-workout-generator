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
import { WorkoutType } from "@/lib/workout-options";

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
            <SelectItem value="Full Body Workout">Full Body Workout</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
