"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipButtonProps extends React.ComponentProps<"button"> {
  active?: boolean;
  compact?: boolean;
}

export function ChipButton({
  active = false,
  compact = false,
  className,
  type = "button",
  ...props
}: ChipButtonProps) {
  return (
    <button
      type={type}
      data-active={active}
      className={cn(
        "rounded-[6px] border border-border bg-transparent font-medium tracking-[0.01em] text-muted-foreground transition-all duration-150 ease-out hover:border-[#2e2e2e] hover:text-foreground",
        "data-[active=true]:border-primary data-[active=true]:bg-primary/12 data-[active=true]:text-primary",
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-[13px]",
        className,
      )}
      aria-pressed={active}
      {...props}
    />
  );
}
