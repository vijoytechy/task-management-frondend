import type { User } from "../types";
import { api } from "./client";

// Fetch all users
export const fetchUsers = () => api<User[]>(`/users`);

//  Create a new user
export const createUser = (user: Partial<User>) =>
  api<User>(`/users`, {
    method: "POST",
    body: JSON.stringify(user),
  });

//  Update a user
export const updateUser = (id: string, user: Partial<User>) =>
  api<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });

//  Delete a user
export const deleteUser = (id: string) =>
  api<void>(`/users/${id}`, {
    method: "DELETE",
  });
