import type { GenerationMode } from "@/lib/generation-types";

interface SubmitButtonProps {
  mode: GenerationMode;
  loading: boolean;
  canSubmit: boolean;
}

export function SubmitButton({ mode, loading, canSubmit }: SubmitButtonProps) {
  const label = mode === "program" ? "Program" : "Workout";
  const isDisabled = !canSubmit || loading;

  return (
    <div>
      <button
        type="submit"
        disabled={isDisabled}
        className="font-wg rounded-wg bg-wg-accent hover:bg-wg-accent-hover disabled:bg-muted disabled:text-ring disabled:hover:bg-muted w-full cursor-pointer border-none py-[15px] text-[13px] font-bold tracking-[0.08em] text-white uppercase transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin-loader inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
            Generating {label}…
          </span>
        ) : (
          `Generate ${label}`
        )}
      </button>

      {mode === "workout" && !canSubmit && !loading && (
        <p className="text-muted-foreground mt-[10px] text-center text-[12px]">
          Select a workout split or body part to continue
        </p>
      )}

      {mode === "program" && !canSubmit && !loading && (
        <p className="text-muted-foreground mt-[10px] text-center text-[12px]">
          Select a program split to continue
        </p>
      )}
    </div>
  );
}
