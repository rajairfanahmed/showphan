"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  const [selectedCategory, setCategoryState] = useState<string>("all");

  // Sync with initial URL parameter on mount or direct navigation
  useEffect(() => {
    const param = searchParams.get("category");
    if (param) {
      // Normalize backwards compatibility (e.g. ai-ml -> ai_ml)
      const normalized = param.replace(/-/g, "_");
      setCategoryState(normalized);
    } else {
      setCategoryState("all");
    }
  }, [searchParams]);

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
