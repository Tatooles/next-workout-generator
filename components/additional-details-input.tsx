"use client";

import { FormSection } from "@/components/chip";
import type { GenerationMode } from "@/lib/generation-types";

const MAX_CHARACTERS = 500;

interface AdditionalDetailsInputProps {
  mode: GenerationMode;
  value: string;
  onChange: (value: string) => void;
}

export function AdditionalDetailsInput({
  mode,
  value,
  onChange,
}: AdditionalDetailsInputProps) {
  return (
    <FormSection
      label="Additional Notes"
      sub={
        mode === "program"
          ? "Goals, injuries, recovery preferences, or training style"
          : "Injuries, preferences, training style"
      }
    >
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARACTERS) {
            onChange(e.target.value);
          }
        }}
        placeholder={
          mode === "program"
            ? "e.g. Focus on progressive overload, avoid overhead pressing..."
            : "e.g. High volume, focus on hypertrophy, avoid heavy squats..."
        }
        rows={4}
        maxLength={MAX_CHARACTERS}
        className="font-wg rounded-wg border-border bg-card text-foreground focus:border-wg-accent min-h-24 w-full resize-y border px-[14px] py-3 text-[13px] leading-[1.55] transition-colors duration-150 outline-none"
      />
      <div className="text-ring mt-[5px] text-right text-[11px]">
        {value.length}/{MAX_CHARACTERS}
      </div>
    </FormSection>
  );
}
