"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/redux/api/categoryApi";
import type { Category } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // Edit modal
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory({
        name: newName.trim(),
        slug: slugify(newName.trim()),
      }).unwrap();
      toast.success("Category created!");
      setNewName("");
      setCreateOpen(false);
    } catch {
      toast.error("Could not create category.");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    try {
      await updateCategory({
        id: editTarget.id,
        name: editName.trim(),
        slug: slugify(editName.trim()),
      }).unwrap();
      toast.success("Category updated!");
      setEditTarget(null);
    } catch {
      toast.error("Could not update category.");
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(cat.id).unwrap();
      toast.success("Category deleted.");
    } catch {
      toast.error("Could not delete category.");
    }
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setEditName(cat.name);
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await updateCategory({ id: cat.id, isActive: !cat.isActive }).unwrap();
      toast.success(cat.isActive ? "Category deactivated." : "Category activated.");
    } catch {
      toast.error("Could not update category.");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Categories
          <span className="ml-2 text-base font-normal text-slate-400">
            ({categories.length})
          </span>
        </h1>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{cat.name}</p>
                <p className="text-xs text-slate-400">{cat.slug}</p>
                <Badge
                  variant={cat.isActive ? "success" : "default"}
                  className="mt-1"
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  title={cat.isActive ? "Deactivate" : "Activate"}
                >
                  <span className="text-xs font-medium">
                    {cat.isActive ? "Off" : "On"}
                  </span>
                </button>
                <button
                  onClick={() => openEdit(cat)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Category"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            id="new-name"
            label="Category Name"
            placeholder="e.g. Mathematics"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          {newName && (
            <p className="text-xs text-slate-400">
              Slug: <span className="font-mono">{slugify(newName)}</span>
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Category"
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <Input
            id="edit-name"
            label="Category Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          {editName && (
            <p className="text-xs text-slate-400">
              Slug: <span className="font-mono">{slugify(editName)}</span>
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={isUpdating}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
