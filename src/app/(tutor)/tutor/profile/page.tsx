"use client";

import { useState, useEffect } from "react";
import {
  useGetMyTutorProfileQuery,
  useCreateTutorProfileMutation,
  useUpdateTutorProfileMutation,
} from "@/lib/redux/api/tutorApi";
import type { CreateTutorProfilePayload, TeachingMode } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { Card, CardBody } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Pencil,
  X,
  MapPin,
  Monitor,
  Laptop,
  Globe,
  Clock,
  Award,
  BookOpen,
  Banknote,
  Star,
  Users,
} from "lucide-react";

const teachingModes: { value: TeachingMode; label: string }[] = [
  { value: "ONLINE", label: "Online Only" },
  { value: "OFFLINE", label: "In-Person Only" },
  { value: "BOTH", label: "Both" },
];

const teachingModeIcon: Record<TeachingMode, React.ReactNode> = {
  ONLINE: <Monitor size={15} />,
  OFFLINE: <MapPin size={15} />,
  BOTH: <Laptop size={15} />,
};

const defaultForm: CreateTutorProfilePayload = {
  headline: "",
  bio: "",
  hourlyRate: 0,
  experience: undefined,
  qualification: "",
  languages: [],
  teachingMode: "ONLINE",
};

export default function TutorProfilePage() {
  const { data, isLoading } = useGetMyTutorProfileQuery();
  const myProfile = data?.data ?? null;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CreateTutorProfilePayload>(defaultForm);
  const [languageInput, setLanguageInput] = useState("");

  const [createProfile, { isLoading: isCreating }] = useCreateTutorProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateTutorProfileMutation();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (myProfile) {
      setForm({
        headline: myProfile.headline ?? "",
        bio: myProfile.bio ?? "",
        hourlyRate: myProfile.hourlyRate,
        experience: myProfile.experience,
        qualification: myProfile.qualification ?? "",
        languages: myProfile.languages,
        teachingMode: myProfile.teachingMode,
      });
    }
  }, [myProfile]);

  const handleChange = (
    key: keyof CreateTutorProfilePayload,
    value: string | number | string[]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const addLanguage = () => {
    const lang = languageInput.trim();
    if (lang && !form.languages?.includes(lang)) {
      handleChange("languages", [...(form.languages ?? []), lang]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) =>
    handleChange("languages", (form.languages ?? []).filter((l) => l !== lang));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (myProfile) {
        await updateProfile(form).unwrap();
        toast.success("Profile updated!");
        setEditing(false);
      } else {
        await createProfile(form).unwrap();
        toast.success("Profile created!");
      }
    } catch {
      toast.error("Could not save profile.");
    }
  };

  const handleCancel = () => {
    if (myProfile) {
      setForm({
        headline: myProfile.headline ?? "",
        bio: myProfile.bio ?? "",
        hourlyRate: myProfile.hourlyRate,
        experience: myProfile.experience,
        qualification: myProfile.qualification ?? "",
        languages: myProfile.languages,
        teachingMode: myProfile.teachingMode,
      });
    }
    setEditing(false);
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  /* ── View Mode ──────────────────────────────────────────────────────────── */
  if (myProfile && !editing) {
    const initials = myProfile.user.name.charAt(0).toUpperCase();

    return (
      <div className="max-w-3xl">
        {/* Header card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-white shadow-lg">
          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <Pencil size={14} />
            Edit Profile
          </button>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            {myProfile.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={myProfile.user.image}
                alt={myProfile.user.name}
                className="h-20 w-20 rounded-2xl border-2 border-white/40 object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/20 text-3xl font-bold shadow-md">
                {initials}
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold">{myProfile.user.name}</h1>
                {myProfile.isVerified && (
                  <span className="rounded-full bg-emerald-400/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-100">
                    Verified
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    myProfile.isAvailable
                      ? "bg-sky-400/30 text-sky-100"
                      : "bg-white/20 text-white/70"
                  }`}
                >
                  {myProfile.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              {myProfile.headline && (
                <p className="mt-1 text-sm text-indigo-100">{myProfile.headline}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-300 text-amber-300" />
                  {myProfile.rating.toFixed(1)} ({myProfile.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  {teachingModeIcon[myProfile.teachingMode]}
                  {teachingModes.find((m) => m.value === myProfile.teachingMode)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/20 pt-5">
            <div className="text-center">
              <p className="text-2xl font-bold">৳{myProfile.hourlyRate}</p>
              <p className="text-xs text-indigo-200">per hour</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-2xl font-bold">
                {myProfile.experience ?? "—"}
              </p>
              <p className="text-xs text-indigo-200">yrs experience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{myProfile.totalReviews}</p>
              <p className="text-xs text-indigo-200">reviews</p>
            </div>
          </div>
        </div>

        {/* Detail cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* About */}
          {myProfile.bio && (
            <Card className="sm:col-span-2">
              <CardBody>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen size={15} className="text-indigo-500" />
                  About
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{myProfile.bio}</p>
              </CardBody>
            </Card>
          )}

          {/* Subjects */}
          {myProfile.categories.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Users size={15} className="text-indigo-500" />
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {myProfile.categories.map((cat) => (
                    <Badge key={cat.id} variant="info">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Languages */}
          {myProfile.languages.length > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Globe size={15} className="text-indigo-500" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {myProfile.languages.map((lang) => (
                    <Badge key={lang} variant="default">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Qualification */}
          {myProfile.qualification && (
            <Card>
              <CardBody>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Award size={15} className="text-indigo-500" />
                  Qualification
                </h3>
                <p className="text-sm text-slate-600">{myProfile.qualification}</p>
              </CardBody>
            </Card>
          )}

          {/* Star rating */}
          {myProfile.totalReviews > 0 && (
            <Card>
              <CardBody>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Star size={15} className="text-indigo-500" />
                  Rating
                </h3>
                <div className="flex items-center gap-3">
                  <StarRating value={myProfile.rating} size={18} />
                  <span className="text-2xl font-bold text-slate-800">
                    {myProfile.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400">
                    / 5 &nbsp;·&nbsp; {myProfile.totalReviews} reviews
                  </span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ── Create / Edit Form ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {myProfile ? "Edit Profile" : "Create Your Profile"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {myProfile
              ? "Update your public tutor profile."
              : "Set up your profile so students can find and book you."}
          </p>
        </div>
        {myProfile && (
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Headline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Basic Info
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="headline"
              label="Headline"
              placeholder="e.g. Expert Math & Physics Tutor"
              value={form.headline ?? ""}
              onChange={(e) => handleChange("headline", e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Bio</label>
              <textarea
                rows={4}
                placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor..."
                value={form.bio ?? ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Rates & Experience */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Rates & Experience
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Banknote
                size={15}
                className="absolute left-3 top-[38px] text-slate-400"
              />
              <Input
                id="rate"
                label="Hourly Rate (৳)"
                type="number"
                min={0}
                value={form.hourlyRate}
                onChange={(e) => handleChange("hourlyRate", Number(e.target.value))}
                required
                className="pl-8"
              />
            </div>
            <div className="relative">
              <Clock
                size={15}
                className="absolute left-3 top-[38px] text-slate-400"
              />
              <Input
                id="experience"
                label="Years of Experience"
                type="number"
                min={0}
                value={form.experience ?? ""}
                onChange={(e) => handleChange("experience", Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>
          <div className="mt-4">
            <Input
              id="qualification"
              label="Qualification"
              placeholder="e.g. BSc Mathematics, MIT"
              value={form.qualification ?? ""}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />
          </div>
        </div>

        {/* Teaching mode */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Teaching Mode
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {teachingModes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange("teachingMode", value)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-colors ${
                  form.teachingMode === value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {teachingModeIcon[value]}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Languages
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a language (e.g. English)"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addLanguage())
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addLanguage}>
              Add
            </Button>
          </div>
          {(form.languages ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(form.languages ?? []).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="ml-1 text-indigo-400 hover:text-indigo-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {myProfile && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isSaving}>
            {myProfile ? "Save Changes" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
