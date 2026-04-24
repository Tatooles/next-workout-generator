import { ChipButton } from "@/components/ui/chip-button";
import {
  programTrainingDaysPerWeekOptions,
  type ProgramSplit,
  type ProgramTrainingDaysPerWeek,
} from "@/lib/workout-options";

interface ProgramDaysPerWeekSelectorProps {
  value: ProgramTrainingDaysPerWeek | null;
  programSplit: ProgramSplit | null;
  onValueChange: (value: ProgramTrainingDaysPerWeek | null) => void;
}

const splitRecommendations: Record<
  ProgramSplit,
  { validDays: ProgramTrainingDaysPerWeek[]; typicalRangeLabel: string }
> = {
  "Push/Pull/Legs": { validDays: [3, 6], typicalRangeLabel: "3 or 6 days" },
  "Upper/Lower": { validDays: [4], typicalRangeLabel: "4 days" },
  "Full Body": { validDays: [2, 3, 4], typicalRangeLabel: "2-4 days" },
  "Body Part Split": {
    validDays: [4, 5, 6],
    typicalRangeLabel: "4-6 days",
  },
  "Arnold Split": { validDays: [3, 6], typicalRangeLabel: "3 or 6 days" },
  Powerbuilding: { validDays: [4, 5], typicalRangeLabel: "4-5 days" },
  "Strength + Conditioning": {
    validDays: [3, 4, 5],
    typicalRangeLabel: "3-5 days",
  },
};

export function ProgramDaysPerWeekSelector({
  value,
  programSplit,
  onValueChange,
}: ProgramDaysPerWeekSelectorProps) {
  const recommendation = programSplit
    ? splitRecommendations[programSplit]
    : null;
  const showWarning =
    !!recommendation && !!value && !recommendation.validDays.includes(value);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
          Training Days Per Week
        </p>
        <p className="text-muted-foreground text-xs">
          Choose 2-6 days, or leave on Auto to let the generator decide.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ChipButton active={value === null} onClick={() => onValueChange(null)}>
          Auto
        </ChipButton>
        {programTrainingDaysPerWeekOptions.map((daysPerWeek) => (
          <ChipButton
            key={daysPerWeek}
            active={value === daysPerWeek}
            onClick={() => onValueChange(daysPerWeek)}
          >
            {daysPerWeek} Days
          </ChipButton>
        ))}
      </div>

      {showWarning ? (
        <p className="text-xs text-primary">
          This split is usually run as {recommendation.typicalRangeLabel}. The
          generator will adapt it to {value} days.
        </p>
      ) : null}
    </div>
  );
}
