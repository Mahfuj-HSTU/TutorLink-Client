"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BookOpen } from "lucide-react";

export default function CategoriesSection() {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Browse by Subject
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Explore hundreds of topics taught by verified experts.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/tutors?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <BookOpen size={22} />
                </div>
                <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/tutors"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            View all subjects →
          </Link>
        </div>
      </div>
    </section>
  );
}
