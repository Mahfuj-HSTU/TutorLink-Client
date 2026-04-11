"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetTutorByIdQuery } from "@/lib/redux/api/tutorApi";
import { useCreateBookingMutation } from "@/lib/redux/api/bookingApi";
import { useSession } from "@/lib/auth-client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  MapPin,
  Monitor,
  Laptop,
  Globe,
  Star,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";

const teachingModeIcon = {
  ONLINE: <Monitor size={16} />,
  OFFLINE: <MapPin size={16} />,
  BOTH: <Laptop size={16} />,
};

const teachingModeLabel = {
  ONLINE: "Online Only",
  OFFLINE: "In-Person Only",
  BOTH: "Online & In-Person",
};

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const user = session?.user;

  const { data, isLoading } = useGetTutorByIdQuery(id);
  const tutor = data?.data;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const handleBook = async () => {
    if (!startTime || !endTime) {
      toast.error("Please fill in both start and end times.");
      return;
    }
    if (!tutor) return;

    try {
      await createBooking({
        tutorId: tutor.id,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        price: tutor.hourlyRate,
      }).unwrap();
      toast.success("Booking confirmed!");
      setBookingOpen(false);
      setStartTime("");
      setEndTime("");
    } catch {
      toast.error("Could not create booking. Please try again.");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage size="lg" />;
  if (!tutor)
    return (
      <div className="py-20 text-center text-slate-500">Tutor not found.</div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {tutor.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tutor.user.image}
            alt={tutor.user.name}
            className="h-28 w-28 rounded-2xl border border-slate-200 object-cover shadow"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-100 text-4xl font-bold text-indigo-700 shadow">
            {tutor.user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {tutor.user.name}
            </h1>
            {tutor.isVerified && <Badge variant="success">Verified</Badge>}
            {tutor.isAvailable ? (
              <Badge variant="info">Available</Badge>
            ) : (
              <Badge variant="danger">Unavailable</Badge>
            )}
          </div>

          {tutor.headline && (
            <p className="mt-1 text-slate-600">{tutor.headline}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              {tutor.rating.toFixed(1)} ({tutor.totalReviews} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              {teachingModeIcon[tutor.teachingMode]}
              {teachingModeLabel[tutor.teachingMode]}
            </span>
            {tutor.experience && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {tutor.experience} yrs experience
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-bold text-indigo-700">
              ${tutor.hourlyRate}
              <span className="text-base font-normal text-slate-400"> / hr</span>
            </span>
            {user?.role === "STUDENT" && tutor.isAvailable && (
              <Button onClick={() => setBookingOpen(true)}>Book Session</Button>
            )}
            {!user && (
              <Button onClick={() => (window.location.href = "/login")}>
                Login to Book
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* About */}
          {tutor.bio && (
            <Card>
              <CardBody>
                <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                  <BookOpen size={18} />
                  About
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {tutor.bio}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardBody>
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Star size={18} />
                Reviews ({tutor.reviews?.length ?? 0})
              </h2>
              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {tutor.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {review.student?.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {review.student?.name ?? "Anonymous"}
                          </p>
                          <StarRating value={review.rating} size={13} />
                        </div>
                        <span className="ml-auto text-xs text-slate-400">
                          {formatDateTime(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No reviews yet.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Subjects */}
          {tutor.categories.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.categories.map((cat) => (
                    <Badge key={cat.id} variant="info">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Languages */}
          {tutor.languages.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Globe size={15} />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.languages.map((lang) => (
                    <Badge key={lang} variant="default">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Qualification */}
          {tutor.qualification && (
            <Card>
              <CardBody>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Award size={15} />
                  Qualification
                </h3>
                <p className="text-sm text-slate-600">{tutor.qualification}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={`Book a session with ${tutor.user.name}`}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            id="start-time"
          />
          <Input
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            id="end-time"
          />
          <p className="text-sm text-slate-500">
            Rate: <span className="font-semibold">${tutor.hourlyRate} / hr</span>
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBook} loading={isBooking}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
