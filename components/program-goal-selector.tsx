import { Chip, FormSection } from "@/components/chip";
import { programGoals, type ProgramGoal } from "@/lib/workout-options";

interface ProgramGoalSelectorProps {
  value: ProgramGoal | null;
  onValueChange: (value: ProgramGoal | null) => void;
}

export function ProgramGoalSelector({
  value,
  onValueChange,
}: ProgramGoalSelectorProps) {
  return (
    <FormSection label="Training Goal" first>
      <div className="flex flex-wrap gap-2">
        {programGoals.map((goal) => (
          <Chip
            key={goal}
            label={goal}
            active={value === goal}
            onClick={() => onValueChange(value === goal ? null : goal)}
          />
        ))}
      </div>
    </FormSection>
  );
}
