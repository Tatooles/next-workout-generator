"use client";

import type { Exercise } from "@/lib/workout-types";

interface ExerciseDetailsProps {
  exercise: Pick<
    Exercise,
    "sets" | "reps" | "restTime" | "muscleGroups" | "formTips"
  >;
  compact?: boolean;
}

export function ExerciseDetails({
  exercise,
  compact = false,
}: ExerciseDetailsProps) {
  const statPillClassName = compact
    ? "rounded-wg-sm inline-flex min-w-[64px] flex-col items-center px-[14px] py-[8px]"
    : "rounded-wg-sm inline-flex min-w-[72px] flex-col items-center px-[18px] py-[9px]";

  const statValueClassName = compact
    ? "text-[16px] font-bold"
    : "text-[18px] font-bold";

  const tipClassName = compact
    ? "flex gap-[8px] text-[12px] leading-[1.5]"
    : "flex gap-[10px] text-[13px] leading-[1.5]";

  return (
    <>
      {/* Stat pills */}
      <div className="mb-[14px] flex flex-wrap gap-2">
        {[
          { value: String(exercise.sets), label: "Sets" },
          { value: exercise.reps, label: "Reps" },
          { value: exercise.restTime, label: "Rest" },
        ].map(({ value, label }) => (
          <div key={label} className={`${statPillClassName} bg-muted`}>
            <span className={`${statValueClassName} text-foreground`}>
              {value}
            </span>
            <span className="mt-[2px] text-[10px] tracking-[0.06em] text-zinc-400 uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Muscle tags */}
      {exercise.muscleGroups.length > 0 && (
        <div className="mb-[14px] flex flex-wrap gap-[6px]">
          {exercise.muscleGroups.map((muscle, i) => (
            <span
              key={i}
              className="bg-wg-accent-sub text-wg-accent rounded-[4px] px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.03em]"
            >
              {muscle}
            </span>
          ))}
        </div>
      )}

      {/* Form tips */}
      {exercise.formTips.length > 0 && (
        <div>
          <div className="mb-[9px] text-[10px] font-bold tracking-[0.08em] text-zinc-400 uppercase">
            Form Tips
          </div>
          <ul className="flex flex-col gap-[7px]">
            {exercise.formTips.map((tip, i) => (
              <li key={i} className={`${tipClassName} text-zinc-400`}>
                <span className="text-wg-accent flex-shrink-0">-</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
