//login and logout functions for authentication
import { api, setAccessToken } from "./client";

export async function login(email: string, password: string) {
    const data = await api<{ access_token: string }>(`/auth/login`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.access_token);
    return data;
}

export function logout() { setAccessToken(null); }