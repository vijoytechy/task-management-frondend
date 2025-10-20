import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../api/users";
import { fetchRoles } from "../../api/roles";
import { Avatar } from "../../components/Avatar";
import type { User, Role } from "../../types";

export function UserManagement() {
  const queryClient = useQueryClient();

  // --- Fetch users ---
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // --- Fetch roles ---
  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // --- Local state ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // --- Handlers ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: formData.name,
      email: formData.email,
      role: formData.roleId,
    };

    if (!editingUser && formData.password) {
      payload.password = formData.password;
    }

    if (editingUser) {
      updateMutation.mutate({ id: editingUser._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }

    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", roleId: "" });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role?._id || "",
    });
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">User Management</h3>

      {/*  User Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border"
      >
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded p-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="border rounded p-2"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {!editingUser && (
            <input
              type="password"
              placeholder="Password"
              className="border rounded p-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          )}

          <select
            className="border rounded p-2"
            value={formData.roleId}
            onChange={(e) =>
              setFormData({ ...formData, roleId: e.target.value })
            }
            required
            disabled={rolesLoading}
          >
            <option value="">
              {rolesLoading ? "Loading roles..." : "Select Role"}
            </option>
            {rolesError && (
              <option value="" disabled>
                Failed to load roles
              </option>
            )}
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="self-start px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>

      {/*  User List */}
      {isLoading && <div>Loading users...</div>}
      {error && (
        <div className="text-red-600">
          {String((error as any)?.message || error)}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white border rounded-xl p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar name={u.name} size={40} />
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                  <div className="text-xs text-gray-400">
                    {u.role?.name || "—"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(u._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
