"use client";

import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AdditionalDetailsInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_CHARACTERS = 500;

export function AdditionalDetailsInput({
  value,
  onChange,
}: AdditionalDetailsInputProps) {
  const characterCount = value.length;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.8;
  const isAtLimit = characterCount >= MAX_CHARACTERS;

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="additionalDetails" className="text-base font-semibold">
          Additional Details (Optional)
        </Label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 gap-1 text-xs"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Add preferences, injuries, goals, or training style (e.g., high volume,
        focus on hypertrophy)
      </p>

      {/* Textarea with character count */}
      <div className="relative">
        <Textarea
          id="additionalDetails"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARACTERS) {
              onChange(e.target.value);
            }
          }}
          placeholder="Add details..."
          className="min-h-[120px] resize-none pr-20"
          maxLength={MAX_CHARACTERS}
        />
        <div
          className={`absolute right-3 bottom-3 text-xs transition-colors ${
            isAtLimit
              ? "text-destructive font-medium"
              : isNearLimit
                ? "text-warning font-medium"
                : "text-muted-foreground"
          }`}
        >
          {characterCount}/{MAX_CHARACTERS}
        </div>
      </div>
    </div>
  );
}
