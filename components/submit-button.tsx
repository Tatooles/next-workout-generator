import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import type { GenerationMode } from "@/lib/generation-types";

interface SubmitButtonProps {
  mode: GenerationMode;
  loading: boolean;
  canSubmit: boolean;
}

export function SubmitButton({
  mode,
  loading,
  canSubmit,
}: SubmitButtonProps) {
  const isProgramMode = mode === "program";

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
      disabled={!canSubmit || loading}
    >
      {loading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Generating {isProgramMode ? "Program" : "Workout"}...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Generate {isProgramMode ? "Program" : "Workout"}
        </>
      )}
    </Button>
  );
}
