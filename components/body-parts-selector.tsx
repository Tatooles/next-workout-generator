import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  muscleGroups,
  muscleGroupConfig,
  type MuscleGroup,
} from "@/lib/muscle-groups";

interface BodyPartsSelectorProps {
  selectedBodyParts: MuscleGroup[];
  onToggle: (bodyPart: MuscleGroup, checked: boolean) => void;
}

export function BodyPartsSelector({
  selectedBodyParts,
  onToggle,
}: BodyPartsSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-muted-foreground mb-4 text-sm">
        Select specific muscle groups to target
      </div>

      {/* Group by category */}
      {["legs", "upper", "arms", "shoulders", "core"].map((category) => {
        const categoryMuscles = muscleGroups.filter(
          (muscle) => muscleGroupConfig[muscle].category === category
        );
        if (categoryMuscles.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <Label className="text-base font-semibold capitalize">
              {category}
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categoryMuscles.map((bodyPart) => {
                const config = muscleGroupConfig[bodyPart];
                const isSelected = selectedBodyParts.includes(bodyPart);

                return (
                  <label
                    key={bodyPart}
                    className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all ${
                      isSelected
                        ? `${config.color} border-current`
                        : "hover:bg-accent"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onToggle(bodyPart, checked === true)
                      }
                    />
                    <span className="flex-1 text-sm font-medium capitalize">
                      {bodyPart}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

