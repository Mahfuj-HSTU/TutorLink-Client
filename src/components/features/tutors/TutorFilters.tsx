"use client";

import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterValues {
  search: string;
  category: string;
  minRate: string;
  maxRate: string;
}

interface TutorFiltersProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export default function TutorFilters({
  filters,
  onChange,
  onReset,
}: TutorFiltersProps) {
  const { data } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  const handleChange = (key: keyof FilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal size={16} />
        Filters
      </div>

      <div className="flex flex-col gap-4">
        {/* Keyword search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search tutors..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Subject
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All subjects</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Hourly Rate ($)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minRate}
              onChange={(e) => handleChange("minRate", e.target.value)}
              min={0}
            />
            <span className="text-slate-400">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxRate}
              onChange={(e) => handleChange("maxRate", e.target.value)}
              min={0}
            />
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
