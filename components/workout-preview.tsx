"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { muscleGroupConfig, type MuscleGroup, type WorkoutType, workoutTypeIcons } from "@/lib/muscle-groups";
import { Dumbbell, Sparkles } from "lucide-react";

interface WorkoutPreviewProps {
  workoutType?: WorkoutType | null;
  bodyParts: MuscleGroup[];
  additionalDetails?: string;
}

export function WorkoutPreview({
  workoutType,
  bodyParts,
  additionalDetails,
}: WorkoutPreviewProps) {
  const hasContent = workoutType || bodyParts.length > 0 || additionalDetails;

  if (!hasContent) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Select a workout type or body parts to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Workout Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workoutType && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Workout Type
            </p>
            <Badge variant="secondary" className="text-sm capitalize">
              {workoutType}
            </Badge>
          </div>
        )}

        {bodyParts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Target Muscles ({bodyParts.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {bodyParts.map((part) => {
                const config = muscleGroupConfig[part];
                const Icon = config.icon;
                return (
                  <Badge
                    key={part}
                    variant="outline"
                    className={`${config.color} capitalize text-xs`}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {part}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {additionalDetails && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Additional Details
            </p>
            <p className="text-sm text-foreground/80 italic">
              "{additionalDetails}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

