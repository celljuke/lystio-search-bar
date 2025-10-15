"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  isSearchMode: boolean;
  isRounded?: "left" | "right" | "none";
  onClick: () => void;
  title: string;
  description?: string;
  value?: string;
  descriptionColor?: "gray" | "black";
  children?: ReactNode;
  className?: string;
  paddingRight?: string;
}

export function SearchTrigger({
  isSearchMode,
  isRounded = "none",
  onClick,
  title,
  description,
  value,
  descriptionColor = "gray",
  children,
  className = "",
  paddingRight,
}: SearchTriggerProps) {
  const roundedClass =
    isRounded === "left"
      ? "rounded-l-full"
      : isRounded === "right"
      ? "rounded-r-full"
      : "";

  const prClass = paddingRight ? paddingRight : isSearchMode ? "pr-6" : "pr-6";

  return (
    <div className={cn("relative flex-1 h-full", className)}>
      <button
        className={cn(
          "flex h-full w-full items-center hover:bg-gray-50 px-6 cursor-pointer bg-transparent border-none transition-colors",
          roundedClass,
          isSearchMode ? "justify-start" : "justify-center",
          prClass
        )}
        type="button"
        onClick={onClick}
      >
        {!isSearchMode ? (
          // Normal state - only title centered
          <span className="text-sm font-medium text-black">{title}</span>
        ) : (
          // Search mode - title + description left-aligned
          <div className="flex flex-col items-start gap-0.5 w-full">
            <span className="text-xs font-medium text-black">{title}</span>
            <span
              className={cn(
                "text-sm font-normal truncate",
                descriptionColor === "gray" ? "text-gray-400" : "text-black"
              )}
            >
              {value || description}
            </span>
          </div>
        )}
      </button>
      {children}
    </div>
  );
}
