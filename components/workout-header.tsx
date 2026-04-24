"use client";

import type { GenerationMode } from "@/lib/generation-types";

const BarbellIcon = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={Math.round(size * 0.5)}
    viewBox="0 0 48 24"
    fill="currentColor"
  >
    <rect x="0"  y="6"  width="5"  height="12" rx="2" />
    <rect x="5"  y="3"  width="3"  height="18" rx="1.5" />
    <rect x="8"  y="10" width="32" height="4"  rx="2" />
    <rect x="40" y="3"  width="3"  height="18" rx="1.5" />
    <rect x="43" y="6"  width="5"  height="12" rx="2" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

interface WorkoutHeaderProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  onToggleTweaks: () => void;
}

export function WorkoutHeader({
  mode,
  onModeChange,
  onToggleTweaks,
}: WorkoutHeaderProps) {
  return (
    <div className="mb-8">
      {/* Top bar: logo + settings */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-[14px]">
          <div
            className="w-[46px] h-[46px] rounded-[11px] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--wg-accent-sub)", color: "var(--wg-accent)" }}
          >
            <BarbellIcon size={26} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-[-0.025em] leading-[1.1]"
              style={{ color: "#edeae6" }}
            >
              Workout Generator
            </h1>
            <p className="text-xs mt-1" style={{ color: "#555" }}>
              AI-powered personalized workouts &amp; weekly programs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTweaks}
          title="Tweaks"
          className="border rounded-[8px] p-2 flex items-center justify-center transition-all duration-150 hover:border-[#2e2e2e] hover:text-[#edeae6] cursor-pointer"
          style={{ background: "transparent", borderColor: "#232323", color: "#555" }}
        >
          <SettingsIcon />
        </button>
      </div>

      {/* Mode toggle pill */}
      <div
        className="inline-flex border rounded-[11px] p-1 gap-[2px]"
        style={{ background: "#111111", borderColor: "#232323" }}
      >
        {(["workout", "program"] as GenerationMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className="px-[22px] py-[7px] text-[13px] rounded-[7px] border-none transition-all duration-150 cursor-pointer tracking-[0.01em]"
            style={{
              background: mode === m ? "#202020" : "transparent",
              color: mode === m ? "#edeae6" : "#555",
              fontWeight: mode === m ? 600 : 500,
            }}
          >
            {m === "workout" ? "Workout" : "Program"}
          </button>
        ))}
      </div>
    </div>
  );
}
