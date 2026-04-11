"use client";

import Navbar from "@/components/layout/Navbar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Users, BookOpen } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <DashboardLayout title="Admin" navItems={adminNav}>
        {children}
      </DashboardLayout>
    </div>
  );
}
