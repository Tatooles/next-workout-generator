"use client";

import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { GenerationMode } from "@/lib/generation-types";

interface AdditionalDetailsInputProps {
  mode: GenerationMode;
  value: string;
  onChange: (value: string) => void;
}

const MAX_CHARACTERS = 500;

export function AdditionalDetailsInput({
  mode,
  value,
  onChange,
}: AdditionalDetailsInputProps) {
  const characterCount = value.length;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.8;
  const isAtLimit = characterCount >= MAX_CHARACTERS;

  const handleClear = () => {
    onChange("");
  };
  const isProgramMode = mode === "program";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
          Additional Notes
        </p>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        {isProgramMode
          ? "Injuries, recovery preferences, weekly constraints, or programming style."
          : "Injuries, preferences, goals, or training style."}
      </p>

      <div className="relative">
        <Textarea
          id="additionalDetails"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARACTERS) {
              onChange(e.target.value);
            }
          }}
          placeholder={
            isProgramMode
              ? "e.g. 2 harder days, more recovery work, avoid overhead pressing..."
              : "e.g. High volume, focus on hypertrophy, avoid heavy squats..."
          }
          className="min-h-24 resize-none rounded-lg border-border bg-card px-4 py-3 pr-20 text-[13px] leading-6 shadow-none focus-visible:border-primary"
          maxLength={MAX_CHARACTERS}
        />
        <div
          className={`absolute right-3 bottom-3 text-xs transition-colors ${
            isAtLimit
              ? "text-destructive font-medium"
              : isNearLimit
                ? "text-primary font-medium"
                : "text-muted-foreground"
          }`}
        >
          {characterCount}/{MAX_CHARACTERS}
        </div>
      </div>
    </div>
  );
}
