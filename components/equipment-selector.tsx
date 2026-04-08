"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  equipmentOptions,
  gymProfiles,
  type EquipmentOption,
  type GymProfile,
} from "@/lib/workout-options";

interface EquipmentSelectorProps {
  gymProfile: GymProfile | null;
  onGymProfileChange: (value: GymProfile | null) => void;
  selectedEquipment: EquipmentOption[];
  onEquipmentToggle: (equipment: EquipmentOption, checked: boolean) => void;
}

export function EquipmentSelector({
  gymProfile,
  onGymProfileChange,
  selectedEquipment,
  onEquipmentToggle,
}: EquipmentSelectorProps) {
  const [open, setOpen] = useState(false);
  const isFullGym = gymProfile === "full commercial gym";

  const handleSelect = (equipment: EquipmentOption) => {
    const isSelected = selectedEquipment.includes(equipment);
    onEquipmentToggle(equipment, !isSelected);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="gym-profile-select" className="text-sm font-medium">
            Available Equipment / Gym Setup (Optional)
          </Label>
          {gymProfile ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onGymProfileChange(null)}
              className="h-7 gap-1 text-xs"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          ) : null}
        </div>
        <Select
          value={gymProfile ?? ""}
          onValueChange={(value) => onGymProfileChange(value as GymProfile)}
        >
          <SelectTrigger id="gym-profile-select" className="w-full">
            <SelectValue placeholder="Choose a gym setup..." />
          </SelectTrigger>
          <SelectContent>
            {gymProfiles.map((profile) => (
              <SelectItem key={profile} value={profile}>
                {profile}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isFullGym ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="equipment-selector" className="text-sm font-medium">
              Extra Equipment (Optional)
            </Label>
            <p className="text-muted-foreground text-xs">
              Add the equipment you know you have access to for more specific
              exercise selection.
            </p>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="equipment-selector"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedEquipment.length > 0
                  ? `${selectedEquipment.length} item${selectedEquipment.length > 1 ? "s" : ""} selected`
                  : "Select equipment..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search equipment..." />
                <CommandList>
                  <CommandEmpty>No equipment found.</CommandEmpty>
                  <CommandGroup heading="Equipment">
                    {equipmentOptions.map((equipment) => {
                      const isSelected = selectedEquipment.includes(equipment);

                      return (
                        <CommandItem
                          key={equipment}
                          value={equipment}
                          onSelect={() => handleSelect(equipment)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="capitalize">{equipment}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedEquipment.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEquipment.map((equipment) => (
                <Badge
                  key={equipment}
                  variant="secondary"
                  className="gap-1 pr-1 capitalize"
                >
                  {equipment}
                  <button
                    type="button"
                    onClick={() => onEquipmentToggle(equipment, false)}
                    className="hover:bg-accent hover:text-accent-foreground ml-1 rounded-sm"
                    aria-label={`Remove ${equipment}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-sm">
            Full commercial gym selected. Additional equipment filters are not
            needed.
          </p>
        </div>
      )}
    </div>
  );
}
