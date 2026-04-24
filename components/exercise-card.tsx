"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/workout-types";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <polyline points={open ? "2,9 7,5 12,9" : "2,5 7,9 12,5"} />
  </svg>
);

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="border rounded-[var(--wg-radius)] overflow-hidden transition-colors duration-150 animate-fade-up"
      style={{
        background: "#111111",
        borderColor: "#232323",
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2e2e2e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#232323")}
    >
      {/* Card header — always visible */}
      <div
        className="flex items-center gap-[14px] px-5 py-4 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Number badge */}
        <div
          className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[13px] font-bold flex-shrink-0"
          style={{ background: "var(--wg-accent-sub)", color: "var(--wg-accent)" }}
        >
          {index + 1}
        </div>

        {/* Name + muscle preview */}
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold text-[15px] leading-[1.2] truncate"
            style={{ color: "#edeae6" }}
          >
            {exercise.name}
          </div>
          <div className="text-[11px] mt-[3px]" style={{ color: "#555" }}>
            {exercise.muscleGroups.slice(0, 3).join(" · ")}
          </div>
        </div>

        {/* Sets × Reps */}
        <div className="flex-shrink-0 text-right mr-1">
          <div
            className="text-[15px] font-bold tracking-[-0.01em]"
            style={{ color: "#edeae6" }}
          >
            {exercise.sets}
            <span style={{ color: "#555", fontWeight: 400 }}>×</span>
            {exercise.reps}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.05em] mt-[1px]"
            style={{ color: "#555" }}
          >
            rest {exercise.restTime}
          </div>
        </div>

        {/* Chevron */}
        <div style={{ color: "#2e2e2e", flexShrink: 0 }}>
          <ChevronIcon open={open} />
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div
          className="border-t px-5 py-4 animate-fade-up-sm"
          style={{ borderColor: "#232323" }}
        >
          {/* Stat pills */}
          <div className="flex gap-2 flex-wrap mb-[14px]">
            {[
              { value: String(exercise.sets), label: "Sets" },
              { value: exercise.reps,         label: "Reps" },
              { value: exercise.restTime,     label: "Rest" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="inline-flex flex-col items-center px-[18px] py-[9px] min-w-[72px] rounded-[var(--wg-radius-sm)]"
                style={{ background: "#181818" }}
              >
                <span
                  className="text-[18px] font-bold"
                  style={{ color: "#edeae6" }}
                >
                  {value}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.06em] mt-[2px]"
                  style={{ color: "#555" }}
                >
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
          {exercise.formTips && exercise.formTips.length > 0 && (
            <div>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[9px]"
                style={{ color: "#555" }}
              >
                Form Tips
              </div>
              <ul className="flex flex-col gap-[7px]">
                {exercise.formTips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-[10px] text-[13px] leading-[1.5]"
                    style={{ color: "#555" }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{ color: "var(--wg-accent)" }}
                    >
                      —
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
