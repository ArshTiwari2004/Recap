"use client";
import React from "react";
import { IconClipboard } from "@tabler/icons-react";
import { cn } from "../../lib/utils";


export const ButtonsCard = ({
    children,
    className,
    onClick
  }) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          "h-auto w-auto bg-white rounded-xl border border-neutral-100 dark:bg-black dark:border-white/[0.2] hover:border-neutral-200 group/btn overflow-hidden relative flex items-center justify-center px-8 py-4",
          className
        )}
      >
        <div className="absolute inset-0 dark:bg-dot-white/[0.1] bg-dot-black/[0.1]" />
        
        <div className="relative z-40">{children}</div>
      </div>
    );
  };
