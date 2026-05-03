import { ChipGroup, FormSection } from "@/components/chip";
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
      <ChipGroup
        options={programGoals}
        value={value}
        onValueChange={onValueChange}
      />
    </FormSection>
  );
}
