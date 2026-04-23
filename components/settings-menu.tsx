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
    id: "moonshotai/kimi-k2.5",
    name: "Kimi K2.5",
    description: "Advanced reasoning with 262k context",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Advanced reasoning with 400k context",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    description: "Enhanced Claude",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    description: "Free and capable",
  },
];

interface SettingsMenuProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SettingsMenu({ value, onValueChange }: SettingsMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-[8px] border-border bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] rounded-[14px] border-border bg-card p-0 sm:w-80"
        align="end"
      >
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
              AI Model
            </p>
            <p className="text-muted-foreground text-sm">
              Choose which AI model powers your workout or program
            </p>
          </div>
          <RadioGroup value={value} onValueChange={onValueChange}>
            <div className="space-y-3">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="flex cursor-pointer items-start space-x-2 rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:bg-accent/70"
                  onClick={() => onValueChange(model.id)}
                >
                  <RadioGroupItem
                    value={model.id}
                    id={model.id}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Label
                      htmlFor={model.id}
                      className="block cursor-pointer text-sm leading-none font-medium"
                    >
                      {model.name}
                    </Label>
                    {model.description && (
                      <p className="text-muted-foreground text-xs">
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
