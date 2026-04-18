import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClearButton } from "@/components/clear-button";
import { experienceLevels, type ExperienceLevel } from "@/lib/workout-options";

interface ExperienceLevelSelectorProps {
  value: ExperienceLevel | null;
  onValueChange: (value: ExperienceLevel | null) => void;
}

export function ExperienceLevelSelector({
  value,
  onValueChange,
}: ExperienceLevelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor="experience-level-select"
          className="text-sm font-medium"
        >
          Experience Level (Optional)
        </Label>
        {value ? (
          <ClearButton onClick={() => onValueChange(null)} />
        ) : null}
      </div>
      <Select
        value={value ?? ""}
        onValueChange={(next) => onValueChange(next as ExperienceLevel)}
      >
        <SelectTrigger id="experience-level-select" className="w-full">
          <SelectValue placeholder="Choose an experience level..." />
        </SelectTrigger>
        <SelectContent>
          {experienceLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
