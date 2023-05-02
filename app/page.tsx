"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function Home() {
  const [split, setSplit] = useState<CheckedState>(false);
  const [bodyPart, setBodyPart] = useState<CheckedState>(false);

  const bodyParts = [
    "quads",
    "hamstrings",
    "glutes",
    "triceps",
    "biceps",
    "chest",
    "lats",
    "upper back",
    "front delts",
    "rear delts",
    "side delts",
  ];

  return (
    <main className="mx-auto flex min-h-screen w-screen flex-col items-center p-5 sm:max-w-xs">
      <h1 className="text-3xl">Workout Generator</h1>
      <div className="mt-4 rounded-md border-2 p-5 shadow-md">
        <div className="flex justify-between">
          <Label className="text-xl">Select Workout Split</Label>
          <Checkbox className="my-auto" onCheckedChange={setSplit} />
        </div>

        {split && (
          <RadioGroup defaultValue="option-one">
            <div className="flex flex-col">
              <div>
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Full Body Workout</Label>
              </div>
              <Label className="text-md">Push Pull Legs Split</Label>
              <div>
                <RadioGroupItem value="leg-workout" id="leg-workout" />
                <Label htmlFor="leg-workout">Leg Workout</Label>
              </div>
              <div>
                <RadioGroupItem value="push-workout" id="push-workout" />
                <Label htmlFor="push-workout">Push Workout</Label>
              </div>
              <div>
                <RadioGroupItem value="push-workout" id="push-workout" />
                <Label htmlFor="push-workout">Pull Workout</Label>
              </div>
            </div>

            <Label className="text-lg">Upper/Lower Split</Label>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upper-workout" id="upper-workout" />
              <Label htmlFor="upper-workout">Upper Workout</Label>
              <RadioGroupItem value="lower-workout" id="lower-workout" />
              <Label htmlFor="lower-workout">Lower Workout</Label>
            </div>
          </RadioGroup>
        )}

        <div className="flex justify-between">
          <Label className="text-xl">Select Body Parts</Label>
          <Checkbox className="my-auto" onCheckedChange={setBodyPart} />
        </div>
        {bodyPart && (
          <>
            <div className="grid grid-cols-2">
              {bodyParts.map((bodyPart) => (
                <div className="flex items-center space-x-2">
                  <Checkbox id={bodyPart} />
                  <label
                    htmlFor={bodyPart}
                    className="text-sm font-medium capitalize leading-none"
                  >
                    {bodyPart}
                  </label>
                </div>
              ))}
            </div>
            <RadioGroup className="mt-4" defaultValue="full-workout">
              <div className="flex flex-col">
                <RadioGroupItem value="full-workout" id="full-workout" />
                <Label htmlFor="full-workout">Full Workout</Label>
                <RadioGroupItem value="single-exercise" id="single-exercise" />
                <Label htmlFor="single-exercise">Single Exercise</Label>
              </div>
            </RadioGroup>
          </>
        )}

        <div>Input section for more details</div>
        <Button className="mt-4">Submit</Button>
      </div>
      <div>Here is where the output will go</div>
    </main>
  );
}
