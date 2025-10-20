import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, API_URL, setAccessToken } from "../api/client";
import { notify } from "../utils/toast";

const Ctx = createContext<any>(null);
export const useAuth = () => useContext(Ctx);

//  Helper to normalize user shape
function normalizeUser(profile: any) {
  if (!profile) return null;

  const role =
    typeof profile.role === "string"
      ? { name: profile.role }
      : profile.role || null;

  return { ...profile, role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [ready, setReady] = useState(false);

  //  Login: sets access token and user
  async function login(email: string, password: string) {
    const data = await api<{ access_token: string; user: any }>(`/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    setAccessToken(data.access_token);
    setUser(normalizeUser(data.user));
  }

  //  Logout: clears token and user
  async function logout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAccessToken(null);
    setUser(null);
    notify.success("Signed out");
  }

  //  Silent refresh when the page loads
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.access_token);

          const profile = await api(`/auth/profile`);
          setUser(normalizeUser(profile));
        }
      } catch (err) {
        console.warn("Silent refresh failed:", err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  //  Utility helpers
  const hasRole = (roleName: string | string[]) => {
    if (!user?.role?.name) return false;
    if (Array.isArray(roleName)) {
      return roleName.includes(user.role.name);
    }
    return user.role.name === roleName;
  };

  const isOwner = (resource: any) => {
    if (!user) return false;
    // Works for resources like Task where assignedTo can be userId or object
    const userId = user.id || user._id;
    const assignedTo =
      typeof resource?.assignedTo === "object"
        ? resource?.assignedTo?._id
        : resource?.assignedTo;
    return userId && assignedTo && String(assignedTo) === String(userId);
  };

  //  Context value
  const value = useMemo(
    () => ({ user, login, logout, ready, hasRole, isOwner }),
    [user, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
