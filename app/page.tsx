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
  const [modelPicker, setModelPicker] = useState<CheckedState>(false);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const bodyParts = [];
    for (const p of formData) {
      if (p[1] == "on") bodyParts.push(p[0]);
    }

    setLoading(true);
    setAnswer(""); // Clear previous answer before starting stream

    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        body: JSON.stringify({
          bodyParts: bodyParts,
          workoutType: formData.get("workoutType"),
          additionalDetails: formData.get("additionalDetails"),
          model: formData.get("model"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      // Get the reader from the response body stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      setLoading(false);

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and append to answer
        const chunk = decoder.decode(value, { stream: true });
        setAnswer((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setLoading(false);
      setAnswer("Failed to generate workout. Please try again.");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-screen flex-col items-center py-5 sm:max-w-xs">
      <h1 className="text-3xl">Workout Generator</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-11/12 flex-col rounded-md border-2 p-5 shadow-md"
      >
        <div className="mb-4 flex justify-between">
          <Label className="text-xl">Select Workout Split</Label>
          <Checkbox className="my-auto" onCheckedChange={setSplit} />
        </div>

        {split && (
          <RadioGroup
            name="workoutType"
            className="pb-4 pl-4"
            defaultValue="option-one"
          >
            <div className="flex flex-col gap-1">
              <Label className="text-md">Push Pull Legs Split</Label>
              <div className="flex gap-2">
                <RadioGroupItem value="leg workout" id="leg workout" />
                <Label htmlFor="leg workout">Leg Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="push workout" id="push workout" />
                <Label htmlFor="push workout">Push Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="pull workout" id="pull workout" />
                <Label htmlFor="pull workout">Pull Workout</Label>
              </div>
            </div>

            <Label className="text-lg">Upper/Lower Split</Label>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <RadioGroupItem
                  value="upper body workout"
                  id="upper body workout"
                />
                <Label htmlFor="upper body workout">Upper Workout</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="lower body workout"
                  id="lower body workout"
                />
                <Label htmlFor="lower body workout">Lower Workout</Label>
              </div>
            </div>

            <Label className="text-lg">Other</Label>
            <div className="flex gap-2">
              <RadioGroupItem
                value="full body workout"
                id="full body workout"
              />
              <Label htmlFor="full body workout">Full Body Workout</Label>
            </div>
          </RadioGroup>
        )}

        <div className="mb-4 flex justify-between">
          <Label className="text-xl">Select Body Parts</Label>
          <Checkbox className="my-auto" onCheckedChange={setBodyPart} />
        </div>
        {bodyPart && (
          <div className="grid grid-cols-2 pb-4 pl-4">
            {bodyParts.map((bodyPart) => (
              <div key={bodyPart} className="flex items-center space-x-2">
                <Checkbox name={bodyPart} />
                <label
                  htmlFor={bodyPart}
                  className="text-sm leading-none font-medium capitalize"
                >
                  {bodyPart}
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 flex justify-between">
          <Label className="text-xl">Select AI Model</Label>
          <Checkbox className="my-auto" onCheckedChange={setModelPicker} />
        </div>
        {modelPicker && (
          <RadioGroup
            name="model"
            className="pb-4 pl-4"
            defaultValue="google/gemini-3-flash-preview"
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <RadioGroupItem
                  value="google/gemini-3-flash-preview"
                  id="gemini-3-flash"
                />
                <Label htmlFor="gemini-3-flash" className="text-sm">
                  Gemini 3 Flash Preview (Default)
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="meta-llama/llama-3.3-70b-instruct:free"
                  id="llama-3.3-70b"
                />
                <Label htmlFor="llama-3.3-70b" className="text-sm">
                  Llama 3.3 70B
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem value="openai/gpt-4o-mini" id="gpt-4o-mini" />
                <Label htmlFor="gpt-4o-mini" className="text-sm">
                  GPT-4o Mini
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="anthropic/claude-3-haiku"
                  id="claude-3-haiku"
                />
                <Label htmlFor="claude-3-haiku" className="text-sm">
                  Claude 3 Haiku
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="deepseek/deepseek-chat"
                  id="deepseek-v3"
                />
                <Label htmlFor="deepseek-v3" className="text-sm">
                  DeepSeek V3
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem
                  value="anthropic/claude-3.5-haiku"
                  id="claude-3.5-haiku"
                />
                <Label htmlFor="claude-3.5-haiku" className="text-sm">
                  Claude 3.5 Haiku
                </Label>
              </div>
            </div>
          </RadioGroup>
        )}

        <div>Additional details:</div>
        <Textarea
          name="additionalDetails"
          placeholder="e.g. '6 sets total,' 'high volume,' 'I have a shoulder injury'"
        />
        <Button type="submit" className="mx-auto mt-4">
          Submit
        </Button>
      </form>
      <div className="mt-4 w-11/12 rounded-md border-2 p-5 whitespace-pre-line">
        {answer}
      </div>
    </main>
  );
}
