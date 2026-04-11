import Navbar from "@/components/layout/Navbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, CalendarDays, User } from "lucide-react";

const studentNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <DashboardLayout title="Student" navItems={studentNav}>
        {children}
      </DashboardLayout>
    </div>
  );
}
