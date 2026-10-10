"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export interface CategoryItem {
  id: string;
  label: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", label: "All Projects" },
  { id: "nextjs", label: "Next.js" },
  { id: "ai_ml", label: "AI and ML" },
  { id: "devtools", label: "Dev Tools" },
  { id: "opensource", label: "Open Source" },
];

interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  categories: CategoryItem[];
}

const CategoryContext = createContext<CategoryContextType>({
  selectedCategory: "all",
  setSelectedCategory: () => {},
  categories: CATEGORIES,
});

export function CategoryFilterProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const rawParam = searchParams.get("category");
  const initialCategory = rawParam ? rawParam.replace(/-/g, "_") : "all";

  const [selectedCategory, setCategoryState] = useState<string>(initialCategory);
  const [prevParam, setPrevParam] = useState<string | null>(rawParam);

  // Sync state during render when URL parameter changes without cascading effect renders
  if (rawParam !== prevParam) {
    setPrevParam(rawParam);
    setCategoryState(rawParam ? rawParam.replace(/-/g, "_") : "all");
  }

  // Smooth daily.dev style instant category switcher with URL sync
  const setSelectedCategory = useCallback((catId: string) => {
    setCategoryState(catId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (catId === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", catId);
      }
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        categories: CATEGORIES,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryFilter() {
  return useContext(CategoryContext);
}
