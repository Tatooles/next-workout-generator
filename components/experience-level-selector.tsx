import { ChipButton } from "@/components/ui/chip-button";
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
      <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
        Experience Level
      </p>
      <div className="flex flex-wrap gap-2">
        {experienceLevels.map((level) => (
          <ChipButton
            key={level}
            active={value === level}
            onClick={() => onValueChange(value === level ? null : level)}
          >
            {level}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}
