import { Chip, FormSection } from "@/components/chip";
import {
  gymProfiles,
  equipmentOptions,
  type GymProfile,
  type EquipmentOption,
} from "@/lib/workout-options";

const GYM_LABELS: Record<GymProfile, string> = {
  "Bodyweight Only":             "Bodyweight",
  "Minimal Apartment/Hotel Gym": "Minimal Gym",
  "Home Dumbbells and Bench":    "Home Gym",
  "Full Commercial Gym":         "Commercial Gym",
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
      {/* Gym profile chips: 2-column grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
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

      {/* Extra equipment chips */}
      {!isFullGym && (
        <>
          <div
            className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[10px]"
            style={{ color: "#555", opacity: 0.7 }}
          >
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
        <div
          className="px-[14px] py-[10px] rounded-[var(--wg-radius-sm)] text-[12px]"
          style={{ background: "#181818", color: "#555" }}
        >
          All commercial gym equipment included
        </div>
      )}
    </FormSection>
  );
}
