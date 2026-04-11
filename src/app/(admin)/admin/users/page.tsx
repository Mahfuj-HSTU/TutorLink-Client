"use client";

import { useState } from "react";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "@/lib/redux/api/adminApi";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import type { User } from "@/types";
import toast from "react-hot-toast";
import { Search, Users } from "lucide-react";

export default function AdminUsersPage() {
  const { data, isLoading } = useGetAllUsersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const users: User[] = data?.data ?? [];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBan = async (user: User) => {
    setUpdatingId(user.id);
    try {
      await updateStatus({ id: user.id, isBanned: !user.isBanned }).unwrap();
      toast.success(
        user.isBanned ? `${user.name} has been unbanned.` : `${user.name} has been banned.`
      );
    } catch {
      toast.error("Could not update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <Users size={48} className="mb-3 opacity-30" />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "danger"
                          : user.role === "TUTOR"
                          ? "info"
                          : "default"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isBanned ? "danger" : "success"}>
                      {user.isBanned ? "Banned" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.role !== "ADMIN" && (
                      <Button
                        size="sm"
                        variant={user.isBanned ? "outline" : "danger"}
                        loading={isUpdating && updatingId === user.id}
                        onClick={() => handleToggleBan(user)}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
