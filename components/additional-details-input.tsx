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
        className="w-full rounded-[var(--wg-radius)] text-[13px] px-[14px] py-3 resize-y leading-[1.55]"
        style={{
          background: "#111111",
          border: "1px solid #232323",
          color: "#edeae6",
          outline: "none",
          fontFamily: "var(--wg-font)",
          transition: "border-color 0.14s",
          minHeight: 96,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--wg-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#232323")}
      />
      <div
        className="text-right text-[11px] mt-[5px]"
        style={{ color: "#2e2e2e" }}
      >
        {value.length}/{MAX_CHARACTERS}
      </div>
    </FormSection>
  );
}
