import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
  className?: string;
}

export function Chip({
  label,
  active,
  onClick,
  small = false,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--wg-radius-sm)] border transition-all duration-150 cursor-pointer leading-none tracking-[0.01em]",
        small ? "px-3 py-[5px] text-xs" : "px-[15px] py-2 text-[13px]",
        active
          ? "border-[var(--wg-accent)] bg-[var(--wg-accent-sub)] text-[var(--wg-accent)] font-semibold"
          : "border-[#232323] bg-transparent text-[#555] hover:border-[#2e2e2e] hover:text-[#edeae6]",
        className,
      )}
    >
      {label}
    </button>
  );
}

interface SectionLabelProps {
  text: string;
  sub?: string;
}

export function SectionLabel({ text, sub }: SectionLabelProps) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#555]">
        {text}
      </div>
      {sub && (
        <div className="text-[12px] text-[#555] mt-1 opacity-80">{sub}</div>
      )}
    </div>
  );
}

interface FormSectionProps {
  label: string;
  sub?: string;
  children: React.ReactNode;
  first?: boolean;
}

export function FormSection({
  label,
  sub,
  children,
  first = false,
}: FormSectionProps) {
  return (
    <div className={cn("pb-6", !first && "border-t border-[#232323] pt-6")}>
      <SectionLabel text={label} sub={sub} />
      {children}
    </div>
  );
}
