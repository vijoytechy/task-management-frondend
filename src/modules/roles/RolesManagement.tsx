import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, createRole } from "../../api/roles";
import type { Role } from "../../types";

export function RolesManagement() {
  const queryClient = useQueryClient();

  // --- Fetch roles ---
  const {
    data: roles = [],
    isLoading,
    error,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // --- Form state ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // --- Mutation for creating role ---
  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setFormData({ name: "", description: "" });
    },
  });

  // --- Submit handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    createMutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Roles Management</h3>

      {/* Create Role Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 items-end bg-gray-50 p-4 rounded-lg border"
      >
        <input
          type="text"
          placeholder="Role Name (e.g. Manager)"
          className="border rounded p-2 flex-1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          className="border rounded p-2 flex-1"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Add Role"}
        </button>
      </form>

      {/*  Role List */}
      {isLoading && <div>Loading roles...</div>}
      {error && (
        <div className="text-red-600">
          {String((error as any)?.message || error)}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-1"
            >
              <div className="font-medium text-indigo-700">{r.name}</div>
              {r.description && (
                <div className="text-sm text-gray-500">{r.description}</div>
              )}
              <div className="text-xs text-gray-400">
                Created: {new Date(r.createdAt || "").toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
