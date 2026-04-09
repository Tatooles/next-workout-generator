import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workoutDurations, type WorkoutDuration } from "@/lib/workout-options";

interface DurationSelectorProps {
  value: WorkoutDuration | null;
  onValueChange: (value: WorkoutDuration | null) => void;
}

export function DurationSelector({
  value,
  onValueChange,
}: DurationSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="duration-select" className="text-sm font-medium">
          Desired Workout Duration (Optional)
        </Label>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onValueChange(null)}
            className="h-7 gap-1 text-xs"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        ) : null}
      </div>
      <Select
        value={value ?? ""}
        onValueChange={(next) => onValueChange(next as WorkoutDuration)}
      >
        <SelectTrigger id="duration-select" className="w-full">
          <SelectValue placeholder="Choose a target duration..." />
        </SelectTrigger>
        <SelectContent>
          {workoutDurations.map((duration) => (
            <SelectItem key={duration} value={duration}>
              {duration}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
