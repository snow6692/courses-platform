"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface QuizContextType {
  isQuizActive: boolean;
  setQuizActive: (active: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isQuizActive, setIsQuizActive] = useState(false);

  const setQuizActive = (active: boolean) => {
    setIsQuizActive(active);
  };

  return (
    <QuizContext.Provider value={{ isQuizActive, setQuizActive }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

// Safe hook that doesn't throw if not wrapped in provider
export function useQuizSafe() {
  const context = useContext(QuizContext);
  return context ?? { isQuizActive: false, setQuizActive: () => {} };
}
