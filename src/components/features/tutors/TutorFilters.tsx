"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Search, SlidersHorizontal } from "lucide-react";

export default function TutorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  // Local state for typed inputs — avoids re-render on every keystroke
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minRate, setMinRate] = useState(searchParams.get("minRate") ?? "");
  const [maxRate, setMaxRate] = useState(searchParams.get("maxRate") ?? "");

  // Skip the initial effect run (values are already in the URL)
  const initialized = useRef(false);

  const buildUrl = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  // Debounce search → URL (400 ms)
  useEffect(() => {
    if (!initialized.current) return;
    const id = setTimeout(() => {
      router.replace(buildUrl({ search }));
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Debounce minRate/maxRate → URL (400 ms)
  useEffect(() => {
    if (!initialized.current) return;
    const id = setTimeout(() => {
      router.replace(buildUrl({ minRate, maxRate }));
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minRate, maxRate]);

  // Mark initialized after first render
  useEffect(() => {
    initialized.current = true;
  }, []);

  const handleCategoryChange = (value: string) => {
    router.replace(buildUrl({ category: value }));
  };

  const handleReset = () => {
    setSearch("");
    setMinRate("");
    setMaxRate("");
    router.replace(pathname);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Subject
          </label>
          <select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
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
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              min={0}
            />
            <span className="text-slate-400">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
