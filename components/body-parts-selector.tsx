"use client";

import { ChipButton } from "@/components/ui/chip-button";
import { muscleGroups, type MuscleGroup } from "@/lib/workout-options";

interface BodyPartsSelectorProps {
  selectedBodyParts: MuscleGroup[];
  onToggle: (bodyPart: MuscleGroup, checked: boolean) => void;
}

export function BodyPartsSelector({
  selectedBodyParts,
  onToggle,
}: BodyPartsSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
          Target Muscles
        </p>
        <p className="text-muted-foreground text-xs">
          Add specific muscle groups if you want the workout or program to bias
          toward them.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {muscleGroups.map((muscle) => {
          const active = selectedBodyParts.includes(muscle);

          return (
            <ChipButton
              key={muscle}
              compact
              active={active}
              onClick={() => onToggle(muscle, !active)}
            >
              {muscle}
            </ChipButton>
          );
        })}
      </div>
    </div>
  );
}
