//global fetch client with token refresh logic and error handling

import { notify } from "../utils/toast";

export const API_URL =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3000";

let accessToken: string | null = null;
let refreshing = false;

// Set or clear the access token
export function setAccessToken(token: string | null) {
  accessToken = token;
}

// Extract a message from the response body
function extractMessage(body: any, fallback = "An unexpected error occurred.") {
  try {
    if (!body) return fallback;
    if (typeof body === "string") {
      const trimmed = body.trim();
      if (!trimmed) return fallback;
      try {
        const parsed = JSON.parse(trimmed);
        return extractMessage(parsed, fallback);
      } catch {
        return trimmed;
      }
    }

    if (typeof body.message === "string") return body.message;
    if (Array.isArray(body.message) && body.message.length) return body.message[0];
    if (body.message?.message) return body.message.message;
    if (typeof body.error === "string") return body.error;
    return fallback;
  } catch {
    return fallback;
  }
}

// Refresh the access token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh");

    const data = await res.json();
    accessToken = data.access_token;
    return accessToken;
  } catch (err) {
    console.error("Refresh failed:", err);
    accessToken = null;
    notify.error("Your session expired. Please log in again.", {
      id: "session-expired",
    });
    return null;
  }
}

// Main API function with automatic token handling
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as any),
  };

  if (init?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    let res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });

    // Handle expired tokens
    if (res.status === 401 && !refreshing) {
      refreshing = true;
      const newToken = await refreshAccessToken();
      refreshing = false;

      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(`${API_URL}${path}`, {
          ...init,
          headers,
          credentials: "include",
        });
      }
    }

    // Handle non-OK responses
    if (!res.ok) {
      const text = await res.text();
      const message = extractMessage(text);
      // mark as already notified to avoid a second toast in catch
      const error: any = new Error(message);
      error.__notified = true;
      notify.error(message);
      throw error;
    }

    // Parse and return JSON safely
    const text = await res.text();
    return text ? JSON.parse(text) : (undefined as any);
  } catch (err: any) {
    const alreadyNotified = (err as any)?.__notified;
    const message = err?.message || "Network error — please try again.";
    if (!alreadyNotified) notify.error(message);
    throw err;
  }
}

