"use client";

import { useState } from "react";
import { copyToClipboard as copyToClipboardUtil } from "@/lib/utils";

export function useCopyToClipboard() {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, key: string = "default") => {
    const success = await copyToClipboardUtil(text);
    if (success) {
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    }
  };

  return {
    copiedStates,
    copyToClipboard,
  };
}
