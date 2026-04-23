import { Dumbbell } from "lucide-react";
import { GenerationModeNav } from "@/components/generation-mode-nav";
import { SettingsMenu } from "@/components/settings-menu";
import type { GenerationMode } from "@/lib/generation-types";

interface WorkoutHeaderProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  model: string;
  onModelChange: (value: string) => void;
}

export function WorkoutHeader({
  mode,
  onModeChange,
  model,
  onModelChange,
}: WorkoutHeaderProps) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-primary/12 text-primary">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[24px] leading-none font-bold tracking-[-0.025em]">
              Workout Generator
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              AI-powered personalized workouts & weekly programs
            </p>
          </div>
        </div>
        <SettingsMenu value={model} onValueChange={onModelChange} />
      </div>

      <GenerationModeNav mode={mode} onModeChange={onModeChange} />
    </div>
  );
}
