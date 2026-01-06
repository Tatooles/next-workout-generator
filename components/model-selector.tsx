"use client";

import { Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isDark =
    mounted &&
    (theme === "dark" || (theme === "system" && resolvedTheme === "dark"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] p-0 sm:w-80" align="end">
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-4">
          {/* Dark Mode Section */}
          <div className="space-y-3">
            <h4 className="leading-none font-medium">Appearance</h4>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-3">
                {mounted && isDark ? (
                  <Moon className="text-muted-foreground h-4 w-4" />
                ) : (
                  <Sun className="text-muted-foreground h-4 w-4" />
                )}
                <div className="space-y-0.5">
                  <Label
                    htmlFor="dark-mode"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Dark Mode
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    {mounted
                      ? isDark
                        ? "Dark theme enabled"
                        : "Light theme enabled"
                      : "Loading..."}
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                disabled={!mounted}
              />
            </div>
          </div>

          {/* AI Model Section */}
          <div className="space-y-2">
            <h4 className="leading-none font-medium">AI Model</h4>
            <p className="text-muted-foreground text-sm">
              Choose which AI model generates your workout
            </p>
          </div>
          <RadioGroup value={value} onValueChange={onValueChange}>
            <div className="space-y-3">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="hover:bg-accent flex cursor-pointer items-start space-x-2 rounded-md border p-3 transition-all hover:shadow-sm"
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
