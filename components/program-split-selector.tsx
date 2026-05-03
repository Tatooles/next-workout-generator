import { ChipGroup, FormSection } from "@/components/chip";
import { programSplits, type ProgramSplit } from "@/lib/workout-options";

interface ProgramSplitSelectorProps {
  value: ProgramSplit | null;
  onValueChange: (value: ProgramSplit | null) => void;
}

export function ProgramSplitSelector({
  value,
  onValueChange,
}: ProgramSplitSelectorProps) {
  return (
    <FormSection label="Program Split" first>
      <ChipGroup
        options={programSplits}
        value={value}
        onValueChange={onValueChange}
      />
    </FormSection>
  );
}
