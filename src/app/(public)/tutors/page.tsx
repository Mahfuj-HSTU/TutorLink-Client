"use client";

import { useState, useCallback } from "react";
import { useGetTutorsQuery } from "@/lib/redux/api/tutorApi";
import TutorCard from "@/components/features/tutors/TutorCard";
import TutorFilters from "@/components/features/tutors/TutorFilters";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Users } from "lucide-react";

interface FilterState {
  search: string;
  category: string;
  minRate: string;
  maxRate: string;
}

const defaultFilters: FilterState = {
  search: "",
  category: "",
  minRate: "",
  maxRate: "",
};

export default function TutorsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const queryParams = {
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.minRate && { minRate: Number(filters.minRate) }),
    ...(filters.maxRate && { maxRate: Number(filters.maxRate) }),
  };

  const { data, isLoading, isFetching } = useGetTutorsQuery(queryParams);
  const tutors = data?.data ?? [];

  const handleReset = useCallback(() => setFilters(defaultFilters), []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Find a Tutor</h1>
        <p className="mt-2 text-slate-500">
          {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-72">
          <TutorFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
          />
        </aside>

        {/* Tutor grid */}
        <div className="flex-1">
          {isLoading || isFetching ? (
            <LoadingSpinner fullPage size="lg" />
          ) : tutors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Users size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No tutors found</p>
              <p className="mt-1 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
