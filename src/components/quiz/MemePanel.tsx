"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemePanelProps {
  show: boolean;
  url: string | null;
  type: "IMAGE" | "GIF" | "VIDEO" | null;
  onClose: () => void;
}

export function MemePanel({ show, url, type, onClose }: MemePanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    if (!isVisible) {
      setShouldRender(false);
      onClose();
    }
  }, [isVisible, onClose]);

  useEffect(() => {
    if (show && url) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // Remove after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, url]);

  if (!shouldRender || !url) return null;

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          key="meme-panel"
          initial={{ opacity: 0, scale: 0.5, y: 100, rotate: -10 }}
          animate={{
            opacity: [0, 1, 1, 0.8, 0.5, 0.2, 0],
            scale: [0.5, 1.1, 1, 1, 1, 1, 0.95],
            y: [100, -10, 0, 0, 0, 0, 20],
            rotate: [-10, 5, 0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 8,
            times: [0, 0.08, 0.12, 0.5, 0.7, 0.85, 1],
            ease: "easeOut",
          }}
          onAnimationComplete={() => setIsVisible(false)}
          className="fixed right-8 bottom-8 z-50"
          style={{ maxWidth: "400px" }}
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20">
            {type === "VIDEO" ? (
              <video
                src={url}
                autoPlay
                loop
                playsInline
                className="w-full rounded-2xl"
                style={{ maxHeight: "350px", objectFit: "cover" }}
              />
            ) : (
              <img
                src={url}
                alt="Meme"
                className="w-full rounded-2xl object-cover"
                style={{ maxHeight: "350px" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
