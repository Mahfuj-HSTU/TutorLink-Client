import Link from "next/link";
import { BookOpen, Mail, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600">
              <BookOpen size={22} />
              <span className="text-lg">TutorLink</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Connecting learners with expert tutors for a personalised, flexible
              learning experience — online or in person.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:hello@tutorlink.com"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Learners */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">For Learners</h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Find a Tutor", href: "/tutors" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Student Dashboard", href: "/dashboard" },
                { label: "My Bookings", href: "/bookings" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tutors */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">For Tutors</h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Become a Tutor", href: "/register" },
                { label: "Tutor Dashboard", href: "/tutor/dashboard" },
                { label: "Manage Profile", href: "/tutor/profile" },
                { label: "Availability", href: "/tutor/availability" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TutorLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
