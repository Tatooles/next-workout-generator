import { ChipGroup, FormSection } from "@/components/chip";
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
      <ChipGroup
        options={experienceLevels}
        value={value}
        onValueChange={onValueChange}
      />
    </FormSection>
  );
}
