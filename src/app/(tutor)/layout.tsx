import Navbar from "@/components/layout/Navbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  BookOpen,
  ToggleRight,
} from "lucide-react";

const tutorNav = [
  { label: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/tutor/bookings", icon: CalendarDays },
  { label: "Profile", href: "/tutor/profile", icon: User },
  { label: "Subjects", href: "/tutor/categories", icon: BookOpen },
  { label: "Availability", href: "/tutor/availability", icon: ToggleRight },
];

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <DashboardLayout title="Tutor" navItems={tutorNav}>
        {children}
      </DashboardLayout>
    </div>
  );
}
