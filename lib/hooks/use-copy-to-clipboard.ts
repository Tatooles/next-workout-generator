"use client";

import { useState } from "react";
import { copyToClipboard as copyToClipboardUtil } from "@/lib/utils";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    const success = await copyToClipboardUtil(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    copied,
    copyToClipboard,
  };
}

