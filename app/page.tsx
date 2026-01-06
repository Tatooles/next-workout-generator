"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelSelector } from "@/components/model-selector";
import { WorkoutPreview } from "@/components/workout-preview";
import {
  muscleGroups,
  muscleGroupConfig,
  type MuscleGroup,
  type WorkoutType,
} from "@/lib/muscle-groups";
import { BicepsFlexed, Dumbbell, Zap } from "lucide-react";

export default function Home() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState<MuscleGroup[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when answer appears
  useEffect(() => {
    if (answer && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [answer]);

  const handleBodyPartToggle = (bodyPart: MuscleGroup, checked: boolean) => {
    if (checked) {
      setSelectedBodyParts([...selectedBodyParts, bodyPart]);
    } else {
      setSelectedBodyParts(selectedBodyParts.filter((bp) => bp !== bodyPart));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        body: JSON.stringify({
          bodyParts: selectedBodyParts,
          workoutType: workoutType,
          additionalDetails: additionalDetails || null,
          model: model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setAnswer((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setLoading(false);
      setAnswer("Failed to generate workout. Please try again.");
    }
  };

  const canSubmit = workoutType || selectedBodyParts.length > 0;

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Header */}
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
          <ModelSelector value={model} onValueChange={setModel} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content - Tabs */}
          <Tabs defaultValue="split" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2">
              <TabsTrigger
                value="split"
                className="flex items-center gap-1.5 py-2.5 text-sm sm:gap-2 sm:py-3"
              >
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">Workout Split</span>
                <span className="xs:hidden">Split</span>
              </TabsTrigger>
              <TabsTrigger
                value="bodyparts"
                className="flex items-center gap-1.5 py-2.5 text-sm sm:gap-2 sm:py-3"
              >
                <BicepsFlexed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">Specific Muscles</span>
                <span className="xs:hidden">Muscles</span>
              </TabsTrigger>
            </TabsList>

            {/* Split Workout Tab */}
            <TabsContent value="split" className="mt-6 space-y-4">
              <div className="text-muted-foreground mb-4 text-sm">
                Choose a structured workout split
              </div>
              <RadioGroup
                value={workoutType || ""}
                onValueChange={(value) => setWorkoutType(value as WorkoutType)}
              >
                {/* Push Pull Legs */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Push Pull Legs Split
                  </Label>
                  <div className="grid gap-2">
                    {[
                      {
                        value: "leg workout",
                        label: "Leg Workout",
                      },
                      {
                        value: "push workout",
                        label: "Push Workout",
                      },
                      {
                        value: "pull workout",
                        label: "Pull Workout",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <span className="flex-1 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upper/Lower Split */}
                <div className="space-y-3 pt-4">
                  <Label className="text-base font-semibold">
                    Upper/Lower Split
                  </Label>
                  <div className="grid gap-2">
                    {[
                      {
                        value: "upper body workout",
                        label: "Upper Body Workout",
                      },
                      {
                        value: "lower body workout",
                        label: "Lower Body Workout",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <span className="flex-1 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other */}
                <div className="space-y-3 pt-4">
                  <Label className="text-base font-semibold">Other</Label>
                  <div className="grid gap-2">
                    <label
                      htmlFor="full body workout"
                      className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors"
                    >
                      <RadioGroupItem
                        value="full body workout"
                        id="full body workout"
                      />
                      <span className="flex-1 font-medium">
                        Full Body Workout
                      </span>
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </TabsContent>

            {/* Body Parts Tab */}
            <TabsContent value="bodyparts" className="mt-6 space-y-4">
              <div className="text-muted-foreground mb-4 text-sm">
                Select specific muscle groups to target
              </div>

              {/* Group by category */}
              {["legs", "upper", "arms", "shoulders", "core"].map(
                (category) => {
                  const categoryMuscles = muscleGroups.filter(
                    (muscle) => muscleGroupConfig[muscle].category === category,
                  );
                  if (categoryMuscles.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <Label className="text-base font-semibold capitalize">
                        {category}
                      </Label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {categoryMuscles.map((bodyPart) => {
                          const config = muscleGroupConfig[bodyPart];
                          const isSelected =
                            selectedBodyParts.includes(bodyPart);

                          return (
                            <label
                              key={bodyPart}
                              className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all ${
                                isSelected
                                  ? `${config.color} border-current`
                                  : "hover:bg-accent"
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleBodyPartToggle(
                                    bodyPart,
                                    checked === true,
                                  )
                                }
                              />
                              <span className="flex-1 text-sm font-medium capitalize">
                                {bodyPart}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
            </TabsContent>
          </Tabs>

          {/* Additional Details */}
          <div className="space-y-3">
            <Label
              htmlFor="additionalDetails"
              className="text-base font-semibold"
            >
              Additional Details (Optional)
            </Label>
            <Textarea
              id="additionalDetails"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g., '6 sets total,' 'high volume,' 'I have a shoulder injury,' 'focus on hypertrophy'"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Preview Card */}
          <WorkoutPreview
            workoutType={workoutType}
            bodyParts={selectedBodyParts}
            additionalDetails={additionalDetails}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Workout
              </>
            )}
          </Button>
        </form>

        {/* Results */}
        {answer && (
          <div
            ref={resultsRef}
            className="bg-card animate-in fade-in slide-in-from-bottom-4 mt-6 rounded-lg border p-4 shadow-sm duration-500 sm:mt-8 sm:p-6"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold sm:text-xl">
              <Dumbbell className="h-5 w-5" />
              Your Workout
            </h2>
            <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line sm:text-base">
              {answer}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
