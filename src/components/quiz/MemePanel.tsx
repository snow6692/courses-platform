"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface MemePanelProps {
  show: boolean;
  url: string | null;
  type: "IMAGE" | "GIF" | "VIDEO" | null;
  onClose: () => void;
}

export function MemePanel({ show, url, type, onClose }: MemePanelProps) {
  const { t, dir } = useLanguage();

  if (!show || !url) return null;

  return (
    <div
      className={`animate-in ${dir === "rtl" ? "slide-in-from-left" : "slide-in-from-right"} fixed bottom-4 ${dir === "rtl" ? "left-4" : "right-4"} z-50 duration-500`}
      style={{ maxWidth: "300px" }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 p-1 shadow-2xl">
        <div className="relative overflow-hidden rounded-xl bg-white">
          <button
            onClick={onClose}
            className={`absolute top-2 ${dir === "rtl" ? "left-2" : "right-2"} z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50`}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="bg-linear-to-r from-purple-600 to-pink-500 px-4 py-2">
            <p className="text-sm font-medium text-white">
              😅 {t("quiz.player.meme_message")}
            </p>
          </div>
          <div className="p-2">
            {type === "VIDEO" ? (
              <video
                src={url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-lg"
                style={{ maxHeight: "200px" }}
              />
            ) : (
              <img
                src={url}
                alt="Meme"
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: "200px" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
