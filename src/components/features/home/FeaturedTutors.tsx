"use client";

import Link from "next/link";
import { useGetTutorsQuery } from "@/lib/redux/api/tutorApi";
import TutorCard from "@/components/features/tutors/TutorCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

export default function FeaturedTutors() {
  const { data, isLoading } = useGetTutorsQuery({});
  const tutors = data?.data?.slice(0, 4) ?? [];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Top-Rated Tutors
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              Hand-picked experts with consistently great reviews.
            </p>
          </div>
          <Link href="/tutors" className="hidden sm:block">
            <Button variant="outline" size="sm">
              See all tutors
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : tutors.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">
            No tutors available yet.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/tutors">
            <Button variant="outline">See all tutors</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
