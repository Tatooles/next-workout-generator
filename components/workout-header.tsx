import { Dumbbell } from "lucide-react";
import { ModelSelector } from "@/components/model-selector";

interface WorkoutHeaderProps {
  model: string;
  onModelChange: (value: string) => void;
}

export function WorkoutHeader({ model, onModelChange }: WorkoutHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
          <Dumbbell className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Workout Generator
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            AI-powered personalized workouts
          </p>
        </div>
      </div>
      <ModelSelector value={model} onValueChange={onModelChange} />
    </div>
  );
}

