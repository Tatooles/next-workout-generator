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
    <div className="mb-6 space-y-4 sm:mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
            <Dumbbell className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Workout Generator
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              AI-powered personalized workouts and weekly programs
            </p>
          </div>
        </div>
        <SettingsMenu value={model} onValueChange={onModelChange} />
      </div>

      <GenerationModeNav mode={mode} onModeChange={onModeChange} />
    </div>
  );
}
