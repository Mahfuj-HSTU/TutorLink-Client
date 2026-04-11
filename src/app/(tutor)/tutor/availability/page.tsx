"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import {
  useGetTutorsQuery,
  useUpdateTutorAvailabilityMutation,
} from "@/lib/redux/api/tutorApi";
import type { TutorProfile } from "@/types";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { ToggleLeft, ToggleRight } from "lucide-react";

export default function TutorAvailabilityPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: tutorsData, isLoading } = useGetTutorsQuery({});
  const myProfile = (tutorsData?.data ?? []).find(
    (t: TutorProfile) => t.userId === userId
  );

  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (myProfile) {
      setIsAvailable(myProfile.isAvailable);
    }
  }, [myProfile]);

  const [updateAvailability, { isLoading: isSaving }] =
    useUpdateTutorAvailabilityMutation();

  const handleToggle = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    try {
      await updateAvailability({ isAvailable: next }).unwrap();
      toast.success(next ? "You are now available." : "You are now unavailable.");
    } catch {
      setIsAvailable(!next); // revert
      toast.error("Could not update availability.");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Availability
      </h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="font-semibold text-slate-900">
            Current Status
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-6 py-8">
          {/* Visual toggle */}
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full transition-colors ${
              isAvailable ? "bg-emerald-100" : "bg-slate-100"
            }`}
          >
            {isAvailable ? (
              <ToggleRight size={48} className="text-emerald-600" />
            ) : (
              <ToggleLeft size={48} className="text-slate-400" />
            )}
          </div>

          <div className="text-center">
            <Badge
              variant={isAvailable ? "success" : "default"}
              className="mb-2 text-sm"
            >
              {isAvailable ? "Available for Bookings" : "Not Available"}
            </Badge>
            <p className="text-sm text-slate-500">
              {isAvailable
                ? "Students can currently book sessions with you."
                : "Your profile is hidden from new booking requests."}
            </p>
          </div>

          <Button
            variant={isAvailable ? "danger" : "primary"}
            onClick={handleToggle}
            loading={isSaving}
          >
            {isAvailable ? "Set as Unavailable" : "Set as Available"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
