"use client";

import { useSession } from "@/lib/auth-client";
import { useGetTutorBookingsQuery } from "@/lib/redux/api/bookingApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CalendarDays, CheckCircle, XCircle, DollarSign } from "lucide-react";

export default function TutorDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, isLoading } = useGetTutorBookingsQuery();
  const bookings = data?.data ?? [];

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const earnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.price, 0);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Hello, {user?.name?.split(" ")[0] ?? "Tutor"}!
        </h1>
        <p className="mt-1 text-indigo-100">
          Here&apos;s an overview of your teaching activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            value: bookings.filter((b) => b.status === "CANCELLED").length,
            icon: XCircle,
            color: "text-red-500 bg-red-50",
          },
          {
            label: "Total Earnings",
            value: `$${earnings.toFixed(0)}`,
            icon: DollarSign,
            color: "text-indigo-600 bg-indigo-50",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardBody className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <Link href="/tutor/bookings">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardBody className="py-10 text-center text-slate-400">
              No bookings yet. Complete your profile to attract students!
              <div className="mt-4">
                <Link href="/tutor/profile">
                  <Button size="sm">Set Up Profile</Button>
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
                      {booking.student?.name ?? "Student"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(booking.startTime).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-indigo-700">
                      ${booking.price}
                    </span>
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
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
