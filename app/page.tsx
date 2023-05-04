"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Textarea } from "@/components/ui/textarea";

type CheckboxValue =
  | "quads"
  | "hamstrings"
  | "glutes"
  | "triceps"
  | "biceps"
  | "chest"
  | "lats"
  | "upper back"
  | "front delts"
  | "rear delts"
  | "side delts"
  | "abs";
const bodyParts: CheckboxValue[] = [
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
  "abs",
];

export default function Home() {
  const [split, setSplit] = useState<CheckedState>(false);
  const [bodyPart, setBodyPart] = useState<CheckedState>(false);

  const [formData, setFormData] = useState();

  const [checkboxes, setCheckboxes] = useState<CheckboxValue[]>([]);
  const [radio, setRadio] = useState("");

  const handleCheckboxChange = (value: CheckedState, part: CheckboxValue) => {
    console.log(part, value);
    if (value) {
      if (checkboxes.includes(part)) {
        setCheckboxes(checkboxes.filter((val) => val !== part));
      } else {
        setCheckboxes([...checkboxes, part]);
      }
    } else {
      // Remove the body part from state
    }
  };

  const handleChange = (e: any) => {
    console.log("tets");
    console.log(e.target);
  };

  const handleSubmit = (e: any) => {
    // TODO: Just ask chatGPT about this shit
    e.preventDefault();
    console.log(checkboxes);
  };

  return (
    <main className="mx-auto flex min-h-screen w-screen flex-col items-center p-5 sm:max-w-xs">
      <h1 className="text-3xl">Workout Generator</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-md border-2 p-5 shadow-md"
      >
        <div className="mb-4 flex justify-between">
          <Label className="text-xl">Select Workout Split</Label>
          <Checkbox className="my-auto" onCheckedChange={setSplit} />
        </div>

        {split && (
          <RadioGroup className="pb-4 pl-4" defaultValue="option-one">
            <div className="flex flex-col gap-1">
              <Label className="text-md">Push Pull Legs Split</Label>
              <div className="flex gap-2">
                <RadioGroupItem value="leg-workout" id="leg-workout" />
                <Label htmlFor="leg-workout">Leg Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="push-workout" id="push-workout" />
                <Label htmlFor="push-workout">Push Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="pull-workout" id="pull-workout" />
                <Label htmlFor="pull-workout">Pull Workout</Label>
              </div>
            </div>

            <Label className="text-lg">Upper/Lower Split</Label>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <RadioGroupItem value="upper-workout" id="upper-workout" />
                <Label htmlFor="upper-workout">Upper Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="lower-workout" id="lower-workout" />
                <Label htmlFor="lower-workout">Lower Workout</Label>
              </div>
            </div>

            <Label className="text-lg">Other</Label>
            <div className="flex gap-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Full Body Workout</Label>
            </div>
          </RadioGroup>
        )}

        <div className="mb-4 flex justify-between">
          <Label className="text-xl">Select Body Parts</Label>
          <Checkbox className="my-auto" onCheckedChange={setBodyPart} />
        </div>
        {bodyPart && (
          <div className="grid grid-cols-2 pb-4 pl-4">
            {bodyParts.map((bodyPart, index) => (
              <div key={bodyPart} className="flex items-center space-x-2">
                <Checkbox
                  checked={checkboxes.includes(bodyPart)}
                  name={bodyPart}
                  onCheckedChange={(event) =>
                    handleCheckboxChange(event, bodyPart)
                  }
                />
                <label
                  htmlFor={bodyPart}
                  className="text-sm font-medium capitalize leading-none"
                >
                  {bodyPart}
                </label>
              </div>
            ))}
          </div>
        )}

        <div>Additional details:</div>
        <Textarea placeholder="ex. '6 sets total' 'high volume' 'I have a shoulder injury'" />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
      <div>Here is where the output will go</div>
    </main>
  );
}
