"use client";

import { useSession } from "@/lib/auth-client";
import { useGetMyBookingsQuery } from "@/lib/redux/api/bookingApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CalendarDays, CheckCircle, XCircle, BookOpen } from "lucide-react";

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, isLoading } = useGetMyBookingsQuery();
  const bookings = data?.data ?? [];

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] ?? "Student"}!
        </h1>
        <p className="mt-1 text-indigo-100">
          Ready to learn something new today?
        </p>
        <div className="mt-4">
          <Link href="/tutors">
            <Button variant="secondary" size="sm">
              Find a Tutor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Upcoming",
            value: confirmed,
            icon: CalendarDays,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Completed",
            value: completed,
            icon: CheckCircle,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Cancelled",
            value: cancelled,
            icon: XCircle,
            color: "text-red-500 bg-red-50",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardBody className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label} Sessions</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <BookOpen size={18} />
            Recent Bookings
          </h2>
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardBody className="py-10 text-center text-slate-400">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p>No bookings yet. Find a tutor and book your first session!</p>
              <div className="mt-4">
                <Link href="/tutors">
                  <Button size="sm">Browse Tutors</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 5).map((booking) => (
              <Card key={booking.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {booking.tutor?.user.name ?? "Tutor"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(booking.startTime).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.status === "CONFIRMED"
                        ? "warning"
                        : booking.status === "COMPLETED"
                        ? "success"
                        : "danger"
                    }
                  >
                    {booking.status}
                  </Badge>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
