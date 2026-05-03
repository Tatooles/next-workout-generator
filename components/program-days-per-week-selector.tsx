import { useEffect } from "react";
import { ChipGroup, FormSection } from "@/components/chip";
import type {
  ProgramSplit,
  ProgramTrainingDaysPerWeek,
} from "@/lib/workout-options";

const DEFAULT_DAYS_OPTIONS: ProgramTrainingDaysPerWeek[] = [3, 4, 5, 6];
const LOW_FREQUENCY_DAYS_OPTIONS: ProgramTrainingDaysPerWeek[] = [
  2,
  ...DEFAULT_DAYS_OPTIONS,
];

interface ProgramDaysPerWeekSelectorProps {
  value: ProgramTrainingDaysPerWeek | null;
  programSplit: ProgramSplit | null;
  onValueChange: (value: ProgramTrainingDaysPerWeek | null) => void;
}

export function ProgramDaysPerWeekSelector({
  value,
  programSplit,
  onValueChange,
}: ProgramDaysPerWeekSelectorProps) {
  const daysOptions =
    programSplit === "Full Body"
      ? LOW_FREQUENCY_DAYS_OPTIONS
      : DEFAULT_DAYS_OPTIONS;

  useEffect(() => {
    if (value !== null && !daysOptions.includes(value)) {
      onValueChange(null);
    }
  }, [daysOptions, onValueChange, value]);

  return (
    <FormSection label="Days Per Week">
      <ChipGroup
        options={daysOptions}
        value={value}
        onValueChange={onValueChange}
        getLabel={(days) => `${days} Days`}
      />
    </FormSection>
  );
}
