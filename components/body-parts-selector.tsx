"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  muscleGroups,
  muscleGroupConfig,
  type MuscleGroup,
} from "@/lib/muscle-groups";

interface BodyPartsSelectorProps {
  selectedBodyParts: MuscleGroup[];
  onToggle: (bodyPart: MuscleGroup, checked: boolean) => void;
}

const categories = [
  { id: "legs", label: "Legs" },
  { id: "upper", label: "Upper Body" },
  { id: "arms", label: "Arms" },
  { id: "shoulders", label: "Shoulders" },
  { id: "core", label: "Core" },
] as const;

export function BodyPartsSelector({
  selectedBodyParts,
  onToggle,
}: BodyPartsSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (muscle: MuscleGroup) => {
    const isSelected = selectedBodyParts.includes(muscle);
    onToggle(muscle, !isSelected);
  };

  const handleRemove = (muscle: MuscleGroup) => {
    onToggle(muscle, false);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="muscle-selector" className="text-sm font-medium">
        Specific Muscles (Optional)
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="muscle-selector"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedBodyParts.length > 0
              ? `${selectedBodyParts.length} muscle${selectedBodyParts.length > 1 ? "s" : ""} selected`
              : "Select muscle groups..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search muscles..." />
            <CommandList>
              <CommandEmpty>No muscle found.</CommandEmpty>
              {categories.map((category) => {
                const categoryMuscles = muscleGroups.filter(
                  (muscle) =>
                    muscleGroupConfig[muscle].category === category.id,
                );
                if (categoryMuscles.length === 0) return null;

                return (
                  <CommandGroup key={category.id} heading={category.label}>
                    {categoryMuscles.map((muscle) => {
                      const isSelected = selectedBodyParts.includes(muscle);
                      return (
                        <CommandItem
                          key={muscle}
                          value={muscle}
                          onSelect={() => handleSelect(muscle)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="capitalize">{muscle}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected muscles as badges */}
      {selectedBodyParts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBodyParts.map((muscle) => (
            <Badge
              key={muscle}
              variant="secondary"
              className="gap-1 pr-1 capitalize"
            >
              {muscle}
              <button
                type="button"
                onClick={() => handleRemove(muscle)}
                className="hover:bg-accent hover:text-accent-foreground ml-1 rounded-sm"
                aria-label={`Remove ${muscle}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
