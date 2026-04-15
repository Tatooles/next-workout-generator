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
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as GenerationMode)}>
      <TabsList aria-label="Generation mode">
        <TabsTrigger value="workout" className="min-w-24">
          Workout
        </TabsTrigger>
        <TabsTrigger value="program" className="min-w-24">
          Program
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
