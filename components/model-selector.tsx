"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface AIModel {
  id: string;
  name: string;
  description?: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    description: "Fast and reliable (Default)",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    description: "Free and capable",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Efficient OpenAI model",
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "Quick responses",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    description: "Advanced reasoning",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    description: "Enhanced Claude",
  },
];

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="AI Model Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Model</h4>
            <p className="text-sm text-muted-foreground">
              Choose which AI model generates your workout
            </p>
          </div>
          <RadioGroup value={value} onValueChange={onValueChange}>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="flex items-start space-x-2 rounded-md border p-3 hover:bg-accent transition-all cursor-pointer hover:shadow-sm"
                  onClick={() => onValueChange(model.id)}
                >
                  <RadioGroupItem value={model.id} id={model.id} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <Label
                      htmlFor={model.id}
                      className="text-sm font-medium leading-none cursor-pointer block"
                    >
                      {model.name}
                    </Label>
                    {model.description && (
                      <p className="text-xs text-muted-foreground">
                        {model.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}

