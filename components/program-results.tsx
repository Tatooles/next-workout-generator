"use client";

import { forwardRef, useState } from "react";
import { ExerciseDetails } from "@/components/exercise-details";
import type { ProgramData, ProgramDay } from "@/lib/workout-types";

const CopyIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,7 5.5,10.5 12,3" />
  </svg>
);

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

function ProgramDayCard({
  day,
  index,
  isOpen,
  onToggle,
}: {
  day: ProgramDay;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border rounded-[var(--wg-radius)] overflow-hidden animate-fade-up"
      style={{
        background: "#111111",
        borderColor: "#232323",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        className="flex w-full items-center gap-[14px] bg-transparent px-5 py-4 text-left cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--wg-accent)]"
        onClick={onToggle}
      >
        <div
          className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 tracking-[0.02em]"
          style={{ background: "var(--wg-accent-sub)", color: "var(--wg-accent)" }}
        >
          D{index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[14px] text-[#edeae6]">
            {day.day} — {day.title}
          </div>
          <div className="mt-[2px] flex flex-col gap-x-2 gap-y-[2px] text-[12px] text-[#8a857d] sm:flex-row sm:flex-wrap sm:items-center">
            {day.focus && <span>{day.focus}</span>}
            {day.focus && (
              <span className="hidden sm:inline" aria-hidden="true">
                |
              </span>
            )}
            <span>Est. {day.estimatedDuration}</span>
          </div>
        </div>
        <div style={{ color: "#2e2e2e", flexShrink: 0 }}>
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div
          className="border-t px-5 py-[14px] animate-fade-up-sm"
          style={{ borderColor: "#232323" }}
        >
          {day.exercises.map((ex, j) => {
            const musclePreview = ex.muscleGroups.slice(0, 3).join(", ");

            return (
              <div
                key={j}
                className="py-4"
                style={{
                  borderBottom:
                    j < day.exercises.length - 1
                      ? "1px solid #232323"
                      : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="w-4 flex-shrink-0 pt-[3px] text-[11px] text-[#8a857d]">
                    {j + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium leading-[1.35] text-[#edeae6]">
                          {ex.name}
                        </div>
                        {musclePreview && (
                          <div className="mt-[3px] text-[12px] leading-[1.45] text-[#8a857d]">
                            {musclePreview}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-medium text-[#8a857d] sm:flex-shrink-0 sm:justify-end sm:text-right">
                        <span>{ex.sets} x {ex.reps}</span>
                        <span>rest {ex.restTime}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ExerciseDetails exercise={ex} compact />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {day.notes && (
            <div className="mt-3 rounded-[var(--wg-radius-sm)] bg-[#181818] px-3 py-2 text-[12px] leading-[1.5] text-[#8a857d]">
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProgramResultsProps {
  program: ProgramData;
  onCopyFull: () => void;
  copiedFull: boolean;
  onReset: () => void;
}

export const ProgramResults = forwardRef<HTMLDivElement, ProgramResultsProps>(
  ({ program, onCopyFull, copiedFull, onReset }, ref) => {
    const [openDay, setOpenDay] = useState(0);

    return (
      <div ref={ref}>
        {/* Header card */}
        <div
          className="border rounded-[var(--wg-radius-lg)] px-[22px] py-5 mb-3 animate-fade-up"
          style={{ background: "#111111", borderColor: "#232323" }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[6px]"
                style={{ color: "var(--wg-accent)" }}
              >
                Generated Program
              </div>
              <div className="text-[22px] font-bold tracking-[-0.02em] text-[#edeae6]">
                Your Program
              </div>
              <div className="mt-1 max-w-[420px] text-[13px] leading-[1.6] text-[#8a857d]">
                {program.weeklyOverview ||
                  `${program.days.length}-day training program`}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={onCopyFull}
                className={`inline-flex cursor-pointer items-center gap-[6px] rounded-[var(--wg-radius-sm)] border px-[14px] py-2 text-[13px] font-medium leading-none transition-all duration-150 ${
                  copiedFull
                    ? "border-[var(--wg-accent)] text-[var(--wg-accent)]"
                    : "border-[#232323] text-[#8a857d]"
                }`}
              >
                {copiedFull ? <CheckIcon /> : <CopyIcon />}
                {copiedFull ? "Copied" : "Copy"}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex cursor-pointer items-center rounded-[var(--wg-radius-sm)] border border-[#232323] bg-transparent px-[14px] py-2 text-[13px] font-medium leading-none text-[#8a857d] transition-all duration-150 hover:border-[#2e2e2e] hover:text-[#edeae6]"
              >
                New Program
              </button>
            </div>
          </div>
        </div>

        <div className="mb-[10px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a857d]">
          Week 1 — Sample Schedule
        </div>

        {/* Day cards */}
        <div className="flex flex-col gap-2">
          {program.days.map((day, i) => (
            <ProgramDayCard
              key={day.day}
              day={day}
              index={i}
              isOpen={openDay === i}
              onToggle={() => setOpenDay(openDay === i ? -1 : i)}
            />
          ))}
        </div>

        {program.progressionNotes && (
          <div className="mt-4 rounded-[var(--wg-radius)] border border-[#232323] bg-[#111111] px-[14px] py-3 text-[13px] leading-[1.6] text-[#8a857d]">
            <div className="mb-[7px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a857d]">
              Progression Plan
            </div>
            <div>{program.progressionNotes}</div>
          </div>
        )}
      </div>
    );
  },
);

ProgramResults.displayName = "ProgramResults";
