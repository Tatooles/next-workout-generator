"use client";

export interface TweaksState {
  accentOklch: string;
  fontFamily: string;
  cardRadius: string;
}

export const TWEAKS_DEFAULTS: TweaksState = {
  accentOklch: "0.44 0.17 13",
  fontFamily: "Space Grotesk",
  cardRadius: "8",
};

const ACCENT_PRESETS = [
  { label: "Crimson",  oklch: "0.44 0.17 13"  },
  { label: "Scarlet",  oklch: "0.46 0.20 22"  },
  { label: "Burgundy", oklch: "0.38 0.14 5"   },
  { label: "Garnet",   oklch: "0.42 0.15 350" },
];

const FONT_OPTIONS = ["Space Grotesk", "DM Sans", "Helvetica Neue"];
const RADIUS_OPTIONS = [
  { value: "4",  label: "Sharp"   },
  { value: "8",  label: "Rounded" },
  { value: "14", label: "Soft"    },
];

interface TweaksPanelProps {
  tweaks: TweaksState;
  onUpdate: (key: keyof TweaksState, value: string) => void;
  onClose: () => void;
}

export function TweaksPanel({ tweaks, onUpdate, onClose }: TweaksPanelProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[240px] rounded-[var(--wg-radius-lg)] p-5 animate-fade-up"
      style={{
        background: "#111111",
        border: "1px solid #2e2e2e",
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[18px]">
        <div
          className="text-[13px] font-bold tracking-[0.02em]"
          style={{ color: "#edeae6" }}
        >
          Tweaks
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[18px] leading-none cursor-pointer transition-colors duration-150 hover:text-[#edeae6]"
          style={{ background: "none", border: "none", color: "#555", padding: 0 }}
        >
          ×
        </button>
      </div>

      {/* Accent color */}
      <div className="mb-4">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[10px]"
          style={{ color: "#555" }}
        >
          Accent Color
        </div>
        <div className="flex gap-[10px]">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.oklch}
              title={p.label}
              type="button"
              onClick={() => onUpdate("accentOklch", p.oklch)}
              className="w-6 h-6 rounded-full cursor-pointer transition-transform duration-150 hover:scale-110 border-2"
              style={{
                background: `oklch(${p.oklch})`,
                borderColor:
                  tweaks.accentOklch === p.oklch ? "#edeae6" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="mb-4">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[10px]"
          style={{ color: "#555" }}
        >
          Font
        </div>
        <div className="flex flex-col gap-[6px]">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => onUpdate("fontFamily", font)}
              className="text-left px-[10px] py-[6px] rounded-[6px] text-[13px] cursor-pointer transition-all duration-150"
              style={{
                fontFamily: font,
                border: `1px solid ${tweaks.fontFamily === font ? "var(--wg-accent)" : "#232323"}`,
                background:
                  tweaks.fontFamily === font
                    ? "var(--wg-accent-sub)"
                    : "transparent",
                color:
                  tweaks.fontFamily === font ? "var(--wg-accent)" : "#555",
                fontWeight: tweaks.fontFamily === font ? 600 : 400,
              }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* Card radius */}
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.08em] mb-[10px]"
          style={{ color: "#555" }}
        >
          Card Radius
        </div>
        <div className="flex gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onUpdate("cardRadius", r.value)}
              className="flex-1 py-[6px] text-[12px] rounded-[6px] cursor-pointer transition-all duration-150"
              style={{
                fontFamily: "var(--wg-font)",
                border: `1px solid ${tweaks.cardRadius === r.value ? "var(--wg-accent)" : "#232323"}`,
                background:
                  tweaks.cardRadius === r.value
                    ? "var(--wg-accent-sub)"
                    : "transparent",
                color:
                  tweaks.cardRadius === r.value ? "var(--wg-accent)" : "#555",
                fontWeight: tweaks.cardRadius === r.value ? 600 : 400,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
