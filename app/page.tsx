import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center p-5">
      <h1 className="text-4xl">Workout Generator</h1>
      <div className="mt-4 rounded-md border-2 p-5 shadow-md">
        <Label className="text-xl">Select Workout Type</Label>

        <RadioGroup className="mt-4" defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Full Body Workout</Label>
          </div>

          <Label className="text-lg">Push Pull Legs Split</Label>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="leg-workout" id="leg-workout" />
            <Label htmlFor="leg-workout">Leg Workout</Label>
            <RadioGroupItem value="push-workout" id="push-workout" />
            <Label htmlFor="push-workout">Push Workout</Label>
            <RadioGroupItem value="push-workout" id="push-workout" />
            <Label htmlFor="push-workout">Pull Workout</Label>
          </div>

          <Label className="text-lg">Upper/Lower Split</Label>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upper-workout" id="upper-workout" />
            <Label htmlFor="upper-workout">Upper Workout</Label>
            <RadioGroupItem value="lower-workout" id="lower-workout" />
            <Label htmlFor="lower-workout">Lower Workout</Label>
          </div>
        </RadioGroup>

        <Label className="text-lg">Add a Body Part</Label>
        {/* TODO: Change to checkbox that's rendered via list */}
        <div className="grid grid-cols-3">
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-workout" id="full-workout" />
            <Label htmlFor="full-workout">Full Workout</Label>
            <RadioGroupItem value="single-exercise" id="single-exercise" />
            <Label htmlFor="single-exercise">Single Exercise</Label>
          </div>
        </RadioGroup>
        <div>Input section for more details</div>
        <Button className="mt-4">Submit</Button>
      </div>
      <div>Here is where the output will go</div>
    </main>
  );
}
