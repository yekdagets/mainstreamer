"use client";

import { useMemo } from "react";
import { Tabs } from "@/components/ui/tabs";
import {
  getAllCategories,
  getCategoryVideoCount,
} from "@/services/categoryService";

interface CategoryTabsProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  showCounts?: boolean;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  showCounts = true,
}: CategoryTabsProps) {
  const categories = getAllCategories();

  const tabs = useMemo(() => {
    const allTab = {
      id: "all",
      label: "All",
      count: showCounts ? undefined : undefined,
    };

    const categoryTabs = categories.map((category) => ({
      id: category,
      label: category,
      count: showCounts ? getCategoryVideoCount(category) : undefined,
    }));

    return [allTab, ...categoryTabs];
  }, [categories, showCounts]);

  const handleTabChange = (tabId: string) => {
    onCategoryChange(tabId === "all" ? null : tabId);
  };

  return (
    <div className="mb-8">
      <Tabs
        tabs={tabs}
        activeTab={activeCategory || "all"}
        onTabChange={handleTabChange}
        variant="pills"
        size="md"
        className="overflow-x-auto pb-2"
      />
    </div>
  );
}
