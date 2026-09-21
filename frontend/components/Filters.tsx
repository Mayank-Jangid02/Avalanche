"use client";

import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";

interface Props {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isListedOnly: boolean;
  onListedOnlyChange: (val: boolean) => void;
}

export const Filters: React.FC<Props> = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isListedOnly,
  onListedOnlyChange,
}) => {
  const categories = ["All", "Digital Art", "Gaming", "Collectibles", "Music", "Photography"];

  const sortOptions = [
    { label: "Recently Listed", value: "recentlyListed" },
    { label: "Price: Low to High", value: "priceLowToHigh" },
    { label: "Price: High to Low", value: "priceHighToLow" },
    { label: "Recently Sold", value: "recentlySold" },
    { label: "Most Popular", value: "mostPopular" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-card rounded-2xl border border-border/80 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5 text-primary" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-glow"
                : "bg-surface hover:bg-white/10 text-gray-300 border border-border/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort & Listed Status Controls */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* Listed Only Switch */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300">
          <input
            type="checkbox"
            checked={isListedOnly}
            onChange={(e) => onListedOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded bg-black/40 border-border text-primary focus:ring-primary focus:ring-offset-background"
          />
          For Sale Only
        </label>

        {/* Sort Dropdown */}
        <div className="relative flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-border/80">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
