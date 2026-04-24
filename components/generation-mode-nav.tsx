"use client";

import type { GenerationMode } from "@/lib/generation-types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GenerationModeNavProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export function GenerationModeNav({
  mode,
  onModeChange,
}: GenerationModeNavProps) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as GenerationMode)}
    >
      <TabsList
        aria-label="Generation mode"
        className="h-auto gap-1 rounded-[11px] border border-border bg-card p-1"
      >
        <TabsTrigger value="workout" className="min-w-24">
          Workout
        </TabsTrigger>
        <TabsTrigger
          value="program"
          className="min-w-24 data-[state=active]:bg-accent"
        >
          Program
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
