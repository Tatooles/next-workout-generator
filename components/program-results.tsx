"use client";

import { forwardRef, useState } from "react";
import type { ProgramData, ProgramDay } from "@/lib/workout-types";

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
      <div
        className="flex items-center gap-[14px] px-5 py-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div
          className="w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 tracking-[0.02em]"
          style={{ background: "var(--wg-accent-sub)", color: "var(--wg-accent)" }}
        >
          D{index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold text-[14px]"
            style={{ color: "#edeae6" }}
          >
            {day.day} — {day.title}
          </div>
          {day.focus && (
            <div className="text-[12px] mt-[2px]" style={{ color: "#555" }}>
              {day.focus}
            </div>
          )}
        </div>
        <div style={{ color: "#2e2e2e", flexShrink: 0 }}>
          <ChevronIcon open={isOpen} />
        </div>
      </div>

      {isOpen && (
        <div
          className="border-t px-5 py-[14px] animate-fade-up-sm"
          style={{ borderColor: "#232323" }}
        >
          {day.exercises.map((ex, j) => (
            <div
              key={j}
              className="flex items-center gap-3 py-[9px]"
              style={{
                borderBottom:
                  j < day.exercises.length - 1 ? "1px solid #232323" : "none",
              }}
            >
              <span
                className="text-[11px] w-4 flex-shrink-0"
                style={{ color: "#2e2e2e" }}
              >
                {j + 1}
              </span>
              <span
                className="flex-1 text-[14px] font-medium"
                style={{ color: "#edeae6" }}
              >
                {ex.name}
              </span>
              <span
                className="text-[12px] font-medium flex-shrink-0"
                style={{ color: "#555" }}
              >
                {ex.sets}×{ex.reps}
              </span>
            </div>
          ))}
          {day.notes && (
            <div
              className="mt-3 px-3 py-2 rounded-[var(--wg-radius-sm)] text-[12px] leading-[1.5]"
              style={{ background: "#181818", color: "#555" }}
            >
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
  onReset: () => void;
}

export const ProgramResults = forwardRef<HTMLDivElement, ProgramResultsProps>(
  ({ program, onReset }, ref) => {
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
              <div
                className="text-[22px] font-bold tracking-[-0.02em]"
                style={{ color: "#edeae6" }}
              >
                Your Program
              </div>
              <div
                className="text-[13px] mt-1 leading-[1.6] max-w-[420px]"
                style={{ color: "#555" }}
              >
                {program.weeklyOverview ||
                  `${program.days.length}-day training program`}
              </div>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center px-[14px] py-2 text-[13px] font-medium rounded-[var(--wg-radius-sm)] border border-[#232323] transition-all duration-150 cursor-pointer leading-none hover:border-[#2e2e2e] hover:text-[#edeae6]"
              style={{ background: "transparent", color: "#555" }}
            >
              New Program
            </button>
          </div>
        </div>

        <div
          className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[10px]"
          style={{ color: "#555" }}
        >
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

        {program.weeklyNotes && (
          <div
            className="mt-4 px-[14px] py-3 rounded-[var(--wg-radius)] text-[13px] leading-[1.6]"
            style={{
              background: "#111111",
              border: "1px solid #232323",
              color: "#555",
            }}
          >
            {program.weeklyNotes}
          </div>
        )}
      </div>
    );
  },
);

ProgramResults.displayName = "ProgramResults";
