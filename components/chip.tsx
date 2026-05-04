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
        "rounded-wg-sm inline-flex cursor-pointer items-center justify-center border leading-none font-semibold whitespace-nowrap transition-all duration-150",
        small ? "px-3 py-[5px] text-xs" : "px-[15px] py-2 text-[13px]",
        active
          ? "border-wg-accent bg-wg-accent-sub text-wg-accent"
          : "border-border text-muted-foreground hover:border-ring hover:text-foreground bg-transparent",
        className,
      )}
    >
      {label}
    </button>
  );
}

interface ChipGroupProps<T extends string | number> {
  options: readonly T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  getLabel?: (option: T) => string;
  className?: string;
  small?: boolean;
}

export function ChipGroup<T extends string | number>({
  options,
  value,
  onValueChange,
  getLabel = (option) => String(option),
  className = "flex flex-wrap gap-2",
  small = false,
}: ChipGroupProps<T>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <Chip
          key={option}
          label={getLabel(option)}
          small={small}
          active={value === option}
          onClick={() => onValueChange(value === option ? null : option)}
        />
      ))}
    </div>
  );
}

interface SectionLabelProps {
  text: string;
  sub?: string;
}

export function SectionLabel({ text, sub }: SectionLabelProps) {
  return (
    <div className="mb-3">
      <div className="text-muted-foreground text-[11px] font-bold tracking-[0.08em] uppercase">
        {text}
      </div>
      {sub && (
        <div className="text-muted-foreground mt-1 text-[12px] opacity-80">
          {sub}
        </div>
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
    <div className={cn("pb-6", !first && "border-border border-t pt-6")}>
      <SectionLabel text={label} sub={sub} />
      {children}
    </div>
  );
}
