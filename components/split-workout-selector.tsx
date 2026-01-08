import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <div className="space-y-4">
      <div className="text-muted-foreground mb-4 text-sm">
        Choose a structured workout split
      </div>
      <RadioGroup
        value={workoutType || ""}
        onValueChange={(value) => onWorkoutTypeChange(value as WorkoutType)}
      >
        {/* Push Pull Legs */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Push Pull Legs Split
          </Label>
          <div className="grid gap-2">
            {[
              {
                value: "leg workout",
                label: "Leg Workout",
              },
              {
                value: "push workout",
                label: "Push Workout",
              },
              {
                value: "pull workout",
                label: "Pull Workout",
              },
            ].map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <span className="flex-1 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upper/Lower Split */}
        <div className="space-y-3 pt-4">
          <Label className="text-base font-semibold">Upper/Lower Split</Label>
          <div className="grid gap-2">
            {[
              {
                value: "upper body workout",
                label: "Upper Body Workout",
              },
              {
                value: "lower body workout",
                label: "Lower Body Workout",
              },
            ].map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <span className="flex-1 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other */}
        <div className="space-y-3 pt-4">
          <Label className="text-base font-semibold">Other</Label>
          <div className="grid gap-2">
            <label
              htmlFor="full body workout"
              className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
            >
              <RadioGroupItem value="full body workout" id="full body workout" />
              <span className="flex-1 font-medium">Full Body Workout</span>
            </label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}

