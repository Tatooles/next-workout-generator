import { Chip, FormSection } from "@/components/chip";
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
      <div className="flex flex-wrap gap-2">
        {programSplits.map((split) => (
          <Chip
            key={split}
            label={split}
            active={value === split}
            onClick={() => onValueChange(value === split ? null : split)}
          />
        ))}
      </div>
    </FormSection>
  );
}
