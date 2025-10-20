import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/toast";

export function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@task-app.com");
  const [password, setPassword] = useState("Secure");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await login(email, password);
      //  Don't navigate here yet — wait until `user` is set
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  //  Navigate when user becomes available after login
  useEffect(() => {
    if (user) {
      notify.success(`Welcome back, ${user.name || ""}`.trim());
      nav("/dashboard", { replace: true });
    }
  }, [user]);

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Sign in</h2>
        {err && <div className="text-sm text-red-600">{err}</div>}

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
