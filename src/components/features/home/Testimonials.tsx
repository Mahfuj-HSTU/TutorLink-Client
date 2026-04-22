import StarRating from "@/components/ui/StarRating";

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "University Student",
    avatar: "S",
    rating: 5,
    quote:
      "I went from failing calculus to acing my finals in six weeks. My tutor explained concepts in a way my professor never could.",
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "High-school Parent",
    avatar: "M",
    rating: 5,
    quote:
      "Booking was painless and the quality is remarkable. My son's confidence in English writing has soared.",
  },
  {
    id: 3,
    name: "Priya M.",
    role: "Professional Learner",
    avatar: "P",
    rating: 5,
    quote:
      "I needed Spanish for a promotion. TutorLink matched me with a native speaker and I passed my language assessment first try.",
  },
];

function TestimonialCard({
  name,
  role,
  avatar,
  rating,
  quote,
}: (typeof testimonials)[0]) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/10 p-5 text-white backdrop-blur-sm sm:p-6">
      <StarRating value={rating} size={15} />
      <p className="mt-3 flex-1 text-xs leading-relaxed text-indigo-100 sm:mt-4 sm:text-sm">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 sm:mt-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-600 sm:h-10 sm:w-10">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-indigo-300">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-indigo-600 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            What Our Learners Say
          </h2>
          <p className="mt-3 text-sm text-indigo-200 sm:mt-4 sm:text-lg">
            Real stories from students who transformed their results.
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="-mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-3 sm:hidden">
          {testimonials.map((t) => (
            <div key={t.id} className="w-72 shrink-0">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        {/* Tablet+: 3-column grid */}
        <div className="mt-10 hidden grid-cols-3 gap-6 sm:grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
