import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Copy, Check } from "lucide-react";

interface WorkoutResultsProps {
  answer: string;
  onCopy: () => void;
  copied: boolean;
}

export const WorkoutResults = forwardRef<HTMLDivElement, WorkoutResultsProps>(
  ({ answer, onCopy, copied }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-card animate-in fade-in slide-in-from-bottom-4 mt-6 rounded-lg border p-4 shadow-sm duration-500 sm:mt-8 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <Dumbbell className="h-5 w-5" />
            Your Workout
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="gap-2 transition-all hover:scale-105"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line sm:text-base">
          {answer}
        </div>
      </div>
    );
  }
);

WorkoutResults.displayName = "WorkoutResults";

