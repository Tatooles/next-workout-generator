"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export function ClearButton({
  onClick,
  className,
  label = "Clear",
}: ClearButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("h-7 gap-1 text-xs", className)}
    >
      <X className="h-3 w-3" />
      {label}
    </Button>
  );
}
