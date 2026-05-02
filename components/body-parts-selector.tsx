import { Chip, FormSection } from "@/components/chip";
import { muscleGroups, type MuscleGroup } from "@/lib/workout-options";

interface BodyPartsSelectorProps {
  selectedBodyParts: MuscleGroup[];
  onToggle: (bodyPart: MuscleGroup) => void;
}

export function BodyPartsSelector({
  selectedBodyParts,
  onToggle,
}: BodyPartsSelectorProps) {
  return (
    <FormSection label="Target Muscles">
      <div className="flex flex-wrap gap-[7px]">
        {muscleGroups.map((muscle) => (
          <Chip
            key={muscle}
            label={muscle}
            small
            active={selectedBodyParts.includes(muscle)}
            onClick={() => onToggle(muscle)}
          />
        ))}
      </div>
    </FormSection>
  );
}
