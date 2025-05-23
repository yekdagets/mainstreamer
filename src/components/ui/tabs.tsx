"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useScrollDetection } from "@/hooks/useScrollDetection";

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  className,
}: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { needsScrolling, showLeftArrow, showRightArrow, scroll } =
    useScrollDetection(containerRef, contentRef, 200);

  const variants = {
    default: needsScrolling
      ? "bg-gray-100 p-1 rounded-lg"
      : "bg-gray-100 p-1 rounded-lg w-fit",
    pills: "",
    underline: "border-b border-gray-200",
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {needsScrolling && showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-8 w-8"
          onClick={() => scroll("left")}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={contentRef}
        className={cn(
          "flex transition-all duration-200",
          variants[variant],
          needsScrolling
            ? "overflow-x-auto scrollbar-hide px-8"
            : "overflow-visible",
          variant === "pills" && "space-x-2"
        )}
        style={
          needsScrolling
            ? { scrollbarWidth: "none", msOverflowStyle: "none" }
            : {}
        }
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          let buttonVariant:
            | "primary"
            | "secondary"
            | "tertiary"
            | "ghost"
            | "link" = "ghost";
          let buttonClassName = "";

          if (variant === "default") {
            buttonVariant = isActive ? "primary" : "ghost";
            buttonClassName = isActive
              ? "bg-white shadow-sm"
              : "text-gray-600 hover:text-gray-900";
          } else if (variant === "pills") {
            buttonVariant = isActive ? "tertiary" : "secondary";
            buttonClassName = isActive ? "shadow-md" : "hover:shadow-sm";
          } else if (variant === "underline") {
            buttonVariant = "ghost";
            buttonClassName = isActive
              ? "text-blue-600 border-b-2 border-blue-600 rounded-none"
              : "text-gray-600 hover:text-gray-900 border-b-2 border-transparent rounded-none";
          }

          return (
            <Button
              key={tab.id}
              variant={buttonVariant}
              size={size}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                buttonClassName,
                needsScrolling && "whitespace-nowrap flex-shrink-0"
              )}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    isActive
                      ? variant === "pills"
                        ? "bg-white/20"
                        : "bg-gray-200 text-gray-600"
                      : "bg-gray-300 text-gray-600"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {needsScrolling && showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-8 w-8"
          onClick={() => scroll("right")}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
