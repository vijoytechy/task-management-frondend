import type { Role } from "../types";
import { api } from "./client";

// Fetch all Roles
export const fetchRoles = () => api<Role[]>(`/roles`);

// Create a new Role
export const createRole = (role: Partial<Role>) =>
  api<Role>(`/roles`, {
    method: "POST",
    body: JSON.stringify(role),
  });