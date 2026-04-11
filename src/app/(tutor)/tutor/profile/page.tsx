"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import {
  useCreateTutorProfileMutation,
  useUpdateTutorProfileMutation,
  useGetTutorsQuery,
} from "@/lib/redux/api/tutorApi";
import type { CreateTutorProfilePayload, TeachingMode, TutorProfile } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import toast from "react-hot-toast";

const teachingModes: { value: TeachingMode; label: string }[] = [
  { value: "ONLINE", label: "Online Only" },
  { value: "OFFLINE", label: "In-Person Only" },
  { value: "BOTH", label: "Both" },
];

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
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch all tutors to find current user's profile
  const { data: tutorsData } = useGetTutorsQuery({});
  const tutors = tutorsData?.data ?? [];
  const myProfile = tutors.find((t: TutorProfile) => t.userId === userId);

  const [form, setForm] = useState<CreateTutorProfilePayload>(defaultForm);
  const [languageInput, setLanguageInput] = useState("");

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

  const [createProfile, { isLoading: isCreating }] =
    useCreateTutorProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateTutorProfileMutation();

  const isLoading = isCreating || isUpdating;

  const handleChange = (
    key: keyof CreateTutorProfilePayload,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addLanguage = () => {
    const lang = languageInput.trim();
    if (lang && !form.languages?.includes(lang)) {
      handleChange("languages", [...(form.languages ?? []), lang]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    handleChange(
      "languages",
      (form.languages ?? []).filter((l) => l !== lang)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (myProfile) {
        await updateProfile(form).unwrap();
        toast.success("Profile updated!");
      } else {
        await createProfile(form).unwrap();
        toast.success("Profile created!");
      }
    } catch {
      toast.error("Could not save profile.");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {myProfile ? "Edit Profile" : "Create Profile"}
      </h1>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="font-semibold text-slate-900">Profile Details</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
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
                placeholder="Tell students about yourself..."
                value={form.bio ?? ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="rate"
                label="Hourly Rate ($)"
                type="number"
                min={0}
                value={form.hourlyRate}
                onChange={(e) =>
                  handleChange("hourlyRate", Number(e.target.value))
                }
                required
              />
              <Input
                id="experience"
                label="Years of Experience"
                type="number"
                min={0}
                value={form.experience ?? ""}
                onChange={(e) =>
                  handleChange("experience", Number(e.target.value))
                }
              />
            </div>

            <Input
              id="qualification"
              label="Qualification"
              placeholder="e.g. BSc Mathematics, MIT"
              value={form.qualification ?? ""}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />

            {/* Teaching mode */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Teaching Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {teachingModes.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange("teachingMode", value)}
                    className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                      form.teachingMode === value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Languages
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a language"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button type="button" variant="secondary" size="sm" onClick={addLanguage}>
                  Add
                </Button>
              </div>
              {(form.languages ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
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

            <div className="flex justify-end">
              <Button type="submit" loading={isLoading}>
                {myProfile ? "Save Changes" : "Create Profile"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
