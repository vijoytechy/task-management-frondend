import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, deleteTask } from "../../api/tasks";
import { notify } from "../../utils/toast";
import { StatusBadge } from "../../components/StatusBadge";
import { Avatar } from "../../components/Avatar";
import { useState } from "react";
import type { Task } from "../../types";
import { TaskFormModal } from "./TaskFormModal";
import { useAuth } from "../../context/AuthContext";

export function TasksPage() {
  const { hasRole, isOwner } = useAuth();

  const isAdmin = hasRole("Admin");

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      notify.success("Task deleted");
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tasks</h2>

        {/*  Only Admin can add */}
        {isAdmin && (
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Task
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className="px-6 py-4" colSpan={5}>
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td className="px-6 py-4 text-red-600" colSpan={5}>
                  {(error as any)?.message || String(error)}
                </td>
              </tr>
            )}
            {!isLoading && !error && tasks.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-gray-500" colSpan={5}>
                  No tasks yet.
                </td>
              </tr>
            )}

            {tasks.map((t) => (
              <tr key={t._id || t.title} className="border-t">
                <td className="px-6 py-4 font-medium">{t.title}</td>
                <td className="px-6 py-4 text-gray-600 max-w-[28rem]">
                  {t.description}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge value={t.status} />
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar name={t.assignedTo?.name || ""} size={36} />
                  <span className="text-sm text-gray-800">
                    {t.assignedTo?.name || "Unassigned"}
                  </span>
                </td>


                <td className="px-6 py-4 text-right">
                  {/*  Admin can edit/delete any task */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => t._id && del.mutate(t._id)}
                        className="ml-2 px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {/*  Non-admin can only edit (status) if owner */}
                  {!isAdmin && isOwner(t) && (
                    <button
                      onClick={() => {
                        setEditing(t);
                        setOpen(true);
                      }}
                      className="px-3 py-1 border  bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Update Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal opens for both Admin and task owner */}
      {open && (
        <TaskFormModal
          initial={editing ?? undefined}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
