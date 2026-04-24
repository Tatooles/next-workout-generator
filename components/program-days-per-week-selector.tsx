import { Chip, FormSection } from "@/components/chip";
import type { ProgramTrainingDaysPerWeek } from "@/lib/workout-options";

const DAYS_OPTIONS: ProgramTrainingDaysPerWeek[] = [3, 4, 5, 6];

interface ProgramDaysPerWeekSelectorProps {
  value: ProgramTrainingDaysPerWeek | null;
  onValueChange: (value: ProgramTrainingDaysPerWeek | null) => void;
}

export function ProgramDaysPerWeekSelector({
  value,
  onValueChange,
}: ProgramDaysPerWeekSelectorProps) {
  return (
    <FormSection label="Days Per Week">
      <div className="flex flex-wrap gap-2">
        {DAYS_OPTIONS.map((days) => (
          <Chip
            key={days}
            label={`${days} Days`}
            active={value === days}
            onClick={() => onValueChange(value === days ? null : days)}
          />
        ))}
      </div>
    </FormSection>
  );
}
