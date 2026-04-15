import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <Label
          htmlFor="program-days-per-week-select"
          className="text-sm font-medium"
        >
          Training Days Per Week
        </Label>
        <p className="text-muted-foreground text-xs">
          Choose 2-6 days, or leave on Auto to let the generator decide.
        </p>
      </div>

      <Select
        value={value ? String(value) : "auto"}
        onValueChange={(nextValue) =>
          onValueChange(
            nextValue === "auto"
              ? null
              : (Number(nextValue) as ProgramTrainingDaysPerWeek),
          )
        }
      >
        <SelectTrigger id="program-days-per-week-select" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto choose</SelectItem>
          {programTrainingDaysPerWeekOptions.map((daysPerWeek) => (
            <SelectItem key={daysPerWeek} value={String(daysPerWeek)}>
              {daysPerWeek} days
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showWarning ? (
        <p className="text-xs text-orange-600 dark:text-orange-400">
          This split is usually run as {recommendation.typicalRangeLabel}. The
          generator will adapt it to {value} days.
        </p>
      ) : null}
    </div>
  );
}
