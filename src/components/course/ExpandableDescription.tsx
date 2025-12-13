"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableDescriptionProps {
  children: React.ReactNode;
  maxHeight?: number;
}

export function ExpandableDescription({
  children,
  maxHeight = 200,
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
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{
          height: isExpanded ? "auto" : showButton ? maxHeight : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      {/* Gradient fade overlay when collapsed */}
      <AnimatePresence>
        {!isExpanded && showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-white to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Show more/less button */}
      {showButton && (
        <div
          className={`mt-4 flex ${dir === "rtl" ? "justify-start" : "justify-start"}`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
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
