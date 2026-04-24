import { Chip, FormSection } from "@/components/chip";
import { programLengths, type ProgramLength } from "@/lib/workout-options";

const LENGTH_LABELS: Record<ProgramLength, string> = {
  "4 weeks":  "4 Weeks",
  "8 weeks":  "8 Weeks",
  "12 weeks": "12 Weeks",
};

interface ProgramLengthSelectorProps {
  value: ProgramLength | null;
  onValueChange: (value: ProgramLength | null) => void;
}

export function ProgramLengthSelector({
  value,
  onValueChange,
}: ProgramLengthSelectorProps) {
  return (
    <FormSection label="Program Length">
      <div className="flex flex-wrap gap-2">
        {programLengths.map((length) => (
          <Chip
            key={length}
            label={LENGTH_LABELS[length]}
            active={value === length}
            onClick={() => onValueChange(value === length ? null : length)}
          />
        ))}
      </div>
    </FormSection>
  );
}
