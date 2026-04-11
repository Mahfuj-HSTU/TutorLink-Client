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

export default function Testimonials() {
  return (
    <section className="bg-indigo-600 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Our Learners Say
          </h2>
          <p className="mt-4 text-lg text-indigo-200">
            Real stories from students who transformed their results.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map(({ id, name, role, avatar, rating, quote }) => (
            <div
              key={id}
              className="rounded-2xl bg-white/10 p-6 text-white backdrop-blur-sm"
            >
              <StarRating value={rating} size={16} />
              <p className="mt-4 text-sm leading-relaxed text-indigo-100">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-600">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-indigo-300">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
