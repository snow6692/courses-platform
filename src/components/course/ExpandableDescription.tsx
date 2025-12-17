"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { cn } from "@/lib/utils";

interface ExpandableDescriptionProps {
  children: React.ReactNode;
  maxHeight?: number;
}

export function ExpandableDescription({
  children,
  maxHeight = 250,
}: ExpandableDescriptionProps) {
  const { t, dir } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowButton(contentHeight > maxHeight);
    }
  }, [maxHeight, children]);

  return (
    <div className="relative" dir={dir}>
      {/* Content container with custom scrollbar */}
      <div
        ref={contentRef}
        className={cn(
          "transition-all duration-300 ease-in-out",
          showButton && !isExpanded && "custom-scrollbar overflow-y-auto",
          showButton && isExpanded && "overflow-visible",
        )}
        style={{
          maxHeight: showButton && !isExpanded ? maxHeight : "none",
        }}
      >
        {children}
      </div>

      {/* Gradient fade overlay when collapsed and scrollable */}
      {!isExpanded && showButton && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent" />
      )}

      {/* Show more/less button */}
      {showButton && (
        <div
          className={cn(
            "mt-4 flex",
            dir === "rtl" ? "justify-start" : "justify-start",
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 rounded-full px-4 text-purple-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700"
          >
            {isExpanded ? (
              <>
                <span>{t("common.show_less") || "عرض أقل"}</span>
                <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                <span>{t("common.show_more") || "عرض المزيد"}</span>
                <ChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
