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
    ? "inline-flex flex-col items-center px-[14px] py-[8px] min-w-[64px] rounded-[var(--wg-radius-sm)]"
    : "inline-flex flex-col items-center px-[18px] py-[9px] min-w-[72px] rounded-[var(--wg-radius-sm)]";

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
          <div
            key={label}
            className={statPillClassName}
            style={{ background: "#181818" }}
          >
            <span className={`${statValueClassName} text-[#edeae6]`}>
              {value}
            </span>
            <span className="mt-[2px] text-[10px] uppercase tracking-[0.06em] text-[#8a857d]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Muscle tags */}
      {exercise.muscleGroups.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mb-[14px]">
          {exercise.muscleGroups.map((muscle, i) => (
            <span
              key={i}
              className="px-[9px] py-[3px] rounded-[4px] text-[11px] font-semibold tracking-[0.03em]"
              style={{
                background: "var(--wg-accent-sub)",
                color: "var(--wg-accent)",
              }}
            >
              {muscle}
            </span>
          ))}
        </div>
      )}

      {/* Form tips */}
      {exercise.formTips.length > 0 && (
        <div>
          <div className="mb-[9px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a857d]">
            Form Tips
          </div>
          <ul className="flex flex-col gap-[7px]">
            {exercise.formTips.map((tip, i) => (
              <li key={i} className={`${tipClassName} text-[#8a857d]`}>
                <span
                  className="flex-shrink-0"
                  style={{ color: "var(--wg-accent)" }}
                >
                  -
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
