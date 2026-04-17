"use client";

import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "@/lib/redux/api/categoryApi";
import {
  useGetMyTutorProfileQuery,
  useUpdateTutorCategoriesMutation,
} from "@/lib/redux/api/tutorApi";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

export default function TutorCategoriesPage() {
  const { data: profileData, isLoading: loadingProfile } = useGetMyTutorProfileQuery();
  const { data: categoriesData, isLoading: loadingCats } = useGetCategoriesQuery();

  const myProfile = profileData?.data ?? null;

  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (myProfile) {
      setSelected(new Set(myProfile.categories.map((c) => c.id)));
    }
  }, [myProfile]);

  const [updateCategories, { isLoading: isSaving }] =
    useUpdateTutorCategoriesMutation();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateCategories({ categoryIds: Array.from(selected) }).unwrap();
      toast.success("Subjects updated!");
    } catch {
      toast.error("Could not update subjects.");
    }
  };

  if (loadingProfile || loadingCats) return <LoadingSpinner fullPage />;

  const categories = categoriesData?.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My Subjects</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <BookOpen size={18} />
              Select the subjects you teach
            </p>
            <Badge variant="info">{selected.size} selected</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((cat) => {
              const isSelected = selected.has(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} loading={isSaving}>
              Save Subjects
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
