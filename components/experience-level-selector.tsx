import { Chip, FormSection } from "@/components/chip";
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
    <FormSection label="Experience Level">
      <div className="flex flex-wrap gap-2">
        {experienceLevels.map((level) => (
          <Chip
            key={level}
            label={level}
            active={value === level}
            onClick={() => onValueChange(value === level ? null : level)}
          />
        ))}
      </div>
    </FormSection>
  );
}
