import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalDetailsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdditionalDetailsInput({
  value,
  onChange,
}: AdditionalDetailsInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="additionalDetails" className="text-base font-semibold">
        Additional Details (Optional)
      </Label>
      <Textarea
        id="additionalDetails"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., '6 sets total,' 'high volume,' 'I have a shoulder injury,' 'focus on hypertrophy'"
        className="min-h-[100px] resize-none"
      />
    </div>
  );
}

