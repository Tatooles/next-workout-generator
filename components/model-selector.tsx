import { Chip, FormSection } from "@/components/chip";
import {
  ALLOWED_MODELS,
  MODEL_LABELS,
  type GenerationModel,
} from "@/lib/model-options";

interface ModelSelectorProps {
  value: GenerationModel;
  onValueChange: (value: GenerationModel) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <FormSection label="AI Model">
      <div className="flex flex-wrap gap-2">
        {ALLOWED_MODELS.map((model) => (
          <Chip
            key={model}
            label={MODEL_LABELS[model]}
            active={value === model}
            onClick={() => onValueChange(model)}
          />
        ))}
      </div>
    </FormSection>
  );
}
