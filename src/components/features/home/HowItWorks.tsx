import { Search, CalendarCheck, Video, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Tutors",
    description:
      "Filter by subject, price range, teaching mode, and rating to find the perfect match.",
  },
  {
    icon: CalendarCheck,
    title: "Book a Session",
    description:
      "Pick a time that suits you and confirm your booking instantly — no back-and-forth emails.",
  },
  {
    icon: Video,
    title: "Start Learning",
    description:
      "Attend your session online or in person and get personalised guidance from your tutor.",
  },
  {
    icon: Star,
    title: "Leave a Review",
    description:
      "Rate your session and help other learners find the best tutors on the platform.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How TutorLink Works
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Four simple steps from discovery to learning.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }, idx) => (
            <div key={title} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-full top-8 hidden h-0.5 w-full -translate-y-1/2 bg-indigo-100 lg:block" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Icon size={28} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
