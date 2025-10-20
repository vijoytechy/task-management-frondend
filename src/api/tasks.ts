// API functions for managing tasks 

import type { Task } from "../types";
import { api } from "./client";
export const fetchTasks = () => api<Task[]>(`/tasks`);
export const createTask = (body: Partial<Task>) => api<Task>(`/tasks`, { method: "POST", body: JSON.stringify(body) });
export const updateTask = (id: string, body: Partial<Task>) => api<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body) });
export const deleteTask = (id: string) => api<void>(`/tasks/${id}`, { method: "DELETE" });