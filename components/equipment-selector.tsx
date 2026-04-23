"use client";

import { ChipButton } from "@/components/ui/chip-button";
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
  const isFullGym = gymProfile === "Full Commercial Gym";

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
            Equipment
          </p>
          <p className="text-muted-foreground text-xs">Gym setup</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {gymProfiles.map((profile) => (
            <ChipButton
              key={profile}
              active={gymProfile === profile}
              onClick={() =>
                onGymProfileChange(gymProfile === profile ? null : profile)
              }
            >
              {profile
                .replace("Only", "")
                .replace("Minimal Apartment/Hotel Gym", "Minimal Gym")
                .replace("Home Dumbbells and Bench", "Home Gym")
                .replace("Full Commercial Gym", "Commercial Gym")}
            </ChipButton>
          ))}
        </div>
      </div>

      {!isFullGym ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
              Extra Equipment
            </p>
            <p className="text-muted-foreground text-xs">
              Add the equipment you know you have access to for more specific
              exercise selection.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((equipment) => {
              const active = selectedEquipment.includes(equipment);

              return (
                <ChipButton
                  key={equipment}
                  compact
                  active={active}
                  onClick={() => onEquipmentToggle(equipment, !active)}
                >
                  {equipment}
                </ChipButton>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-secondary px-4 py-3">
          <p className="text-muted-foreground text-sm">
            All commercial gym equipment included.
          </p>
        </div>
      )}
    </div>
  );
}
