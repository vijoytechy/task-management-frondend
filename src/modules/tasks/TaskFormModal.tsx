import React, { useState } from "react";
import type { Status, Task, User } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask } from "../../api/tasks";
import { notify } from "../../utils/toast";
import { fetchUsers } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export function TaskFormModal({
  initial,
  onClose,
}: {
  initial?: Task;
  onClose: () => void;
}) {
  const { hasRole, isOwner } = useAuth();
  const isAdmin = hasRole("Admin");
  const owner = initial ? isOwner(initial) : false;

  const isEdit = Boolean(initial);
  const qc = useQueryClient();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: isAdmin, // only admins need to fetch users list
  });

  const create = useMutation({
    mutationFn: (body: Partial<Task>) => createTask(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      notify.success("Task created");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Task> }) =>
      updateTask(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      notify.success("Task updated");
    },
  });

  // --- form state ---
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState<Status>(
    (initial?.status as Status) || "Pending"
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    initial?.assignedTo && typeof initial.assignedTo === "object"
      ? initial.assignedTo._id
      : typeof initial?.assignedTo === "string"
      ? initial.assignedTo
      : ""
  );

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // --- submit ---
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const payload: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        status,
        assignedTo:
          typeof assignedTo === "object"
            ? (assignedTo as any)._id
            : assignedTo || null,
      };

      //  Restrict payload based on role
      if (!isAdmin && owner) {
        // user can only update status
        delete payload.title;
        delete payload.description;
        delete payload.assignedTo;
      }

      if (!payload.title && !isEdit) throw new Error("Title is required");

      if (isEdit && initial?._id) {
        await update.mutateAsync({ id: initial._id, body: payload });
      } else {
        await create.mutateAsync(payload);
      }

      onClose();
    } catch (e: any) {
      setErr(e?.message || "Failed to save task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 z-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Task" : "Create Task"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {err && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
              {err}
            </div>
          )}

          {/*  Only Admin can edit title/description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              disabled={!isAdmin}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              disabled={!isAdmin}
              className="w-full rounded-lg border px-3 py-2 min-h-[90px] focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Status</label>
              <select
                disabled={!isAdmin && !owner}
                className="w-full rounded-lg border px-3 py-2 bg-white disabled:bg-gray-100"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/*  Only Admin can assign tasks */}
            {isAdmin && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {busy
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
