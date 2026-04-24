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
        className="w-full py-[15px] text-[13px] font-bold uppercase tracking-[0.08em] rounded-[var(--wg-radius)] border-none transition-colors duration-200"
        style={{
          background: isDisabled ? "#181818" : "var(--wg-accent)",
          color: isDisabled ? "#2e2e2e" : "#ffffff",
          cursor: isDisabled ? "not-allowed" : "pointer",
          fontFamily: "var(--wg-font)",
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) e.currentTarget.style.background = "var(--wg-accent-h)";
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) e.currentTarget.style.background = "var(--wg-accent)";
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent"
              style={{ animation: "spinLoader 0.7s linear infinite" }}
            />
            Generating {label}…
          </span>
        ) : (
          `Generate ${label}`
        )}
      </button>

      {mode === "workout" && !canSubmit && !loading && (
        <p
          className="text-[12px] text-center mt-[10px]"
          style={{ color: "#555" }}
        >
          Select a workout split to continue
        </p>
      )}
    </div>
  );
}
