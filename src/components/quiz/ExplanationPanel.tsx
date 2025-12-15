"use client";

import { useState, useEffect } from "react";
import { X, Play, BookOpen, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useVideoUrl } from "@/hooks/useVideoUrl";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useLanguage } from "@/providers/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ExplanationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  explanation: string | null;
  explanationImageKey: string | null;
  explanationVideoKey: string | null;
}

export default function ExplanationPanel({
  isOpen,
  onClose,
  questionText,
  explanation,
  explanationImageKey,
  explanationVideoKey,
}: ExplanationPanelProps) {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"video" | "text" | "image">(
    "video",
  );

  const explanationImageUrl = useConstructUrl(explanationImageKey || "");
  const { data: videoUrl, isLoading: videoLoading } = useVideoUrl(
    explanationVideoKey || "",
  );

  // Determine which tab to show by default based on available content
  useEffect(() => {
    if (explanationVideoKey) {
      setActiveTab("video");
    } else if (explanation) {
      setActiveTab("text");
    } else if (explanationImageKey) {
      setActiveTab("image");
    }
  }, [explanationVideoKey, explanation, explanationImageKey, isOpen]);

  const hasVideo = !!explanationVideoKey;
  const hasText = !!explanation;
  const hasImage = !!explanationImageKey;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: dir === "rtl" ? "-100%" : "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir === "rtl" ? "-100%" : "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed top-0 ${dir === "rtl" ? "left-0" : "right-0"} z-50 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {t("quiz.result.watch_explanation")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Question Text */}
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700">
                  {questionText}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b px-4 py-3">
              {hasVideo && (
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "video"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Play className="h-4 w-4" />
                  {t("quiz.result.explanation_video")}
                </button>
              )}
              {hasText && (
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "text"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  {t("quiz.result.explanation_text")}
                </button>
              )}
              {hasImage && (
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "image"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  {t("quiz.result.explanation_image")}
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Video Tab */}
              {activeTab === "video" && hasVideo && (
                <div className="overflow-hidden rounded-xl bg-black">
                  {videoLoading ? (
                    <div className="flex aspect-video items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                  ) : videoUrl ? (
                    <video
                      controls
                      autoPlay
                      className="aspect-video w-full"
                      src={videoUrl}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      <source src={videoUrl} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-white">
                      {t("quiz.result.video_not_available")}
                    </div>
                  )}
                </div>
              )}

              {/* Text Tab */}
              {activeTab === "text" && hasText && (
                <div className="prose prose-sm max-w-none rounded-xl bg-gray-50 p-6">
                  <RenderDescription json={explanation} />
                </div>
              )}

              {/* Image Tab */}
              {activeTab === "image" && hasImage && (
                <div className="flex justify-center rounded-xl bg-gray-50 p-4">
                  <img
                    src={explanationImageUrl}
                    alt="Explanation"
                    className="max-h-[70vh] rounded-lg object-contain"
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 flex gap-3 border-t bg-white p-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                {t("quiz.result.back_to_lesson")}
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={onClose}
              >
                {t("quiz.result.back_to_quiz")}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
