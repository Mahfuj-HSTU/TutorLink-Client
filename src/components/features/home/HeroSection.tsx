import Link from "next/link";
import Button from "@/components/ui/Button";
import { Search, Star, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 py-20 sm:py-28">
      {/* Decorative blob */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-100 opacity-60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <Star size={14} className="fill-indigo-400 text-indigo-400" />
            Trusted by 10,000+ learners
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Learn from the{" "}
            <span className="text-indigo-600">Best Tutors</span> — on Your
            Schedule
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            TutorLink connects you with verified expert tutors across every
            subject. Book sessions online or in-person, at a time that works for
            you.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/tutors">
              <Button size="lg" className="gap-2">
                <Search size={18} />
                Find a Tutor
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="gap-2">
                <Users size={18} />
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "500+", label: "Expert Tutors" },
            { value: "10k+", label: "Students" },
            { value: "50+", label: "Subjects" },
            { value: "4.9★", label: "Avg. Rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-center shadow-sm backdrop-blur"
            >
              <p className="text-3xl font-extrabold text-indigo-600">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
