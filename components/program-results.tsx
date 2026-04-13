import { forwardRef } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/exercise-card";
import type { ProgramData, ProgramDay } from "@/lib/workout-types";

interface ProgramResultsProps {
  program: ProgramData;
  onCopyFull: () => void;
  onCopyTemplate: () => void;
  copiedFull: boolean;
  copiedTemplate: boolean;
}

function ProgramDayCard({ day }: { day: ProgramDay }) {
  const isWorkoutDay = day.type === "workout";

  return (
    <section className="bg-card rounded-lg border p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{day.day}</p>
          <h3 className="text-xl font-semibold">{day.title}</h3>
          {day.focus ? (
            <p className="text-muted-foreground mt-1 text-sm">{day.focus}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm">
            {isWorkoutDay ? "Workout Day" : "Rest / Recovery"}
          </p>
          {day.estimatedDuration ? (
            <p className="text-sm font-medium">{day.estimatedDuration}</p>
          ) : null}
        </div>
      </div>

      {day.notes ? (
        <div className="bg-muted/50 mt-4 rounded-md p-3">
          <p className="text-muted-foreground text-sm">{day.notes}</p>
        </div>
      ) : null}

      {isWorkoutDay ? (
        <div className="mt-4 space-y-4">
          {day.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export const ProgramResults = forwardRef<HTMLDivElement, ProgramResultsProps>(
  (
    { program, onCopyFull, onCopyTemplate, copiedFull, copiedTemplate },
    ref,
  ) => {
    return (
      <div ref={ref} className="mt-6 space-y-4 sm:mt-8">
        <div className="bg-card rounded-lg border p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="mb-1 text-xl font-bold sm:text-2xl">
                Your Program
              </h2>
              <p className="text-muted-foreground text-sm">
                A full 7-day week from Monday through Sunday
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyFull}
                className="gap-2"
              >
                {copiedFull ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Program
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyTemplate}
                className="gap-2"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Template
                  </>
                )}
              </Button>
            </div>
          </div>

          {program.weeklyOverview ? (
            <div className="bg-muted/50 mt-4 rounded-md p-3">
              <p className="text-muted-foreground text-sm">
                {program.weeklyOverview}
              </p>
            </div>
          ) : null}

          {program.weeklyNotes ? (
            <div className="bg-muted/30 mt-3 rounded-md border p-3">
              <p className="text-muted-foreground text-sm">
                {program.weeklyNotes}
              </p>
            </div>
          ) : null}
        </div>

        {program.days.map((day) => (
          <ProgramDayCard key={day.day} day={day} />
        ))}
      </div>
    );
  },
);

ProgramResults.displayName = "ProgramResults";
