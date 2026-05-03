import { Chip, FormSection } from "@/components/chip";
import {
  gymProfiles,
  equipmentOptions,
  type GymProfile,
  type EquipmentOption,
} from "@/lib/workout-options";

const GYM_LABELS: Record<GymProfile, string> = {
  "Bodyweight Only": "Bodyweight",
  "Minimal Apartment/Hotel Gym": "Minimal Gym",
  "Home Dumbbells and Bench": "Home Gym",
  "Full Commercial Gym": "Commercial Gym",
};

interface EquipmentSelectorProps {
  gymProfile: GymProfile | null;
  onGymProfileChange: (value: GymProfile | null) => void;
  selectedEquipment: EquipmentOption[];
  onEquipmentToggle: (equipment: EquipmentOption) => void;
}

export function EquipmentSelector({
  gymProfile,
  onGymProfileChange,
  selectedEquipment,
  onEquipmentToggle,
}: EquipmentSelectorProps) {
  const isFullGym = gymProfile === "Full Commercial Gym";

  return (
    <FormSection label="Equipment" sub="Gym setup">
      <div className="mb-4 grid grid-cols-2 gap-2">
        {gymProfiles.map((profile) => (
          <Chip
            key={profile}
            label={GYM_LABELS[profile]}
            active={gymProfile === profile}
            onClick={() =>
              onGymProfileChange(gymProfile === profile ? null : profile)
            }
          />
        ))}
      </div>

      {!isFullGym && (
        <>
          <div className="text-muted-foreground mb-[10px] text-[11px] font-semibold tracking-[0.06em] uppercase opacity-70">
            Extra equipment
          </div>
          <div className="flex flex-wrap gap-[7px]">
            {equipmentOptions.map((eq) => (
              <Chip
                key={eq}
                label={eq}
                small
                active={selectedEquipment.includes(eq)}
                onClick={() => onEquipmentToggle(eq)}
              />
            ))}
          </div>
        </>
      )}

      {isFullGym && (
        <div className="rounded-wg-sm bg-muted text-muted-foreground px-[14px] py-[10px] text-[12px]">
          All commercial gym equipment included
        </div>
      )}
    </FormSection>
  );
}
