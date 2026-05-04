"use client";

import { cn } from "@/lib/utils";

export interface TweaksState {
  accentOklch: string;
  fontFamily: FontFamily;
  cardRadius: string;
}

export const TWEAKS_DEFAULTS: TweaksState = {
  accentOklch: "0.44 0.17 13",
  fontFamily: "Space Grotesk",
  cardRadius: "8",
};

const ACCENT_PRESETS = [
  {
    label: "Crimson",
    oklch: "0.44 0.17 13",
    className: "bg-[oklch(0.44_0.17_13)]",
  },
  {
    label: "Scarlet",
    oklch: "0.46 0.20 22",
    className: "bg-[oklch(0.46_0.20_22)]",
  },
  {
    label: "Burgundy",
    oklch: "0.38 0.14 5",
    className: "bg-[oklch(0.38_0.14_5)]",
  },
  {
    label: "Garnet",
    oklch: "0.42 0.15 350",
    className: "bg-[oklch(0.42_0.15_350)]",
  },
];

export const FONT_OPTIONS = [
  "Space Grotesk",
  "DM Sans",
  "Helvetica Neue",
] as const;

export type FontFamily = (typeof FONT_OPTIONS)[number];

export function isFontFamily(value: string): value is FontFamily {
  return FONT_OPTIONS.some((font) => font === value);
}

const FONT_CLASS_NAMES: Record<FontFamily, string> = {
  "Space Grotesk": "font-space-grotesk",
  "DM Sans": "font-dm-sans",
  "Helvetica Neue": "font-helvetica-neue",
};
const RADIUS_OPTIONS = [
  { value: "4", label: "Sharp" },
  { value: "8", label: "Rounded" },
  { value: "14", label: "Soft" },
];

interface TweaksPanelProps {
  tweaks: TweaksState;
  onUpdate: <K extends keyof TweaksState>(
    key: K,
    value: TweaksState[K],
  ) => void;
  onClose: () => void;
}

export function TweaksPanel({ tweaks, onUpdate, onClose }: TweaksPanelProps) {
  return (
    <div className="animate-fade-up shadow-tweaks rounded-wg-lg border-ring bg-card fixed right-6 bottom-6 z-50 w-[240px] border p-5">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="text-foreground text-[13px] font-bold tracking-[0.02em]">
          Tweaks
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent p-0 text-[18px] leading-none transition-colors duration-150"
        >
          ×
        </button>
      </div>

      <div className="mb-4">
        <div className="text-muted-foreground mb-[10px] text-[10px] font-bold tracking-[0.08em] uppercase">
          Accent Color
        </div>
        <div className="flex gap-[10px]">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.oklch}
              title={p.label}
              type="button"
              onClick={() => onUpdate("accentOklch", p.oklch)}
              className={cn(
                "h-6 w-6 cursor-pointer rounded-full border-2 transition-colors duration-150",
                p.className,
                tweaks.accentOklch === p.oklch
                  ? "border-foreground"
                  : "border-transparent",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-muted-foreground mb-[10px] text-[10px] font-bold tracking-[0.08em] uppercase">
          Font
        </div>
        <div className="flex flex-col gap-[6px]">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => onUpdate("fontFamily", font)}
              className={cn(
                "cursor-pointer rounded-[6px] border px-[10px] py-[6px] text-left text-[13px] font-semibold transition-all duration-150",
                FONT_CLASS_NAMES[font],
                tweaks.fontFamily === font
                  ? "border-wg-accent bg-wg-accent-sub text-wg-accent"
                  : "border-border text-muted-foreground bg-transparent",
              )}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-muted-foreground mb-[10px] text-[10px] font-bold tracking-[0.08em] uppercase">
          Card Radius
        </div>
        <div className="flex gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onUpdate("cardRadius", r.value)}
              className={cn(
                "font-wg flex-1 cursor-pointer rounded-[6px] border py-[6px] text-[12px] font-semibold transition-all duration-150",
                tweaks.cardRadius === r.value
                  ? "border-wg-accent bg-wg-accent-sub text-wg-accent"
                  : "border-border text-muted-foreground bg-transparent",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
