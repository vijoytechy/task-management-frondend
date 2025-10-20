import React, { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "./utils/toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { TasksPage } from "./modules/tasks/TasksPage";
import { SettingsPage } from "./modules/settings/SettingsPage";
import { LoginPage } from "./modules/auth/LoginPage";

//  Protected route that supports role restrictions
function Protected({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[]; 
}) {
  const { user, ready, hasRole } = useAuth();

  if (!ready) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // ✅ If specific roles required
  if (roles && !hasRole(roles)) {
    return (
      <div className="p-8 text-center text-gray-500">
        Access denied. You do not have permission to view this page.
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const qc = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={toastOptions} />
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard (all authenticated users) */}
            <Route
              path="/"
              element={
                <Protected>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </Protected>
              }
            />

            {/* Tasks (all authenticated roles) */}
            <Route
              path="/tasks"
              element={
                <Protected>
                  <Layout>
                    <TasksPage />
                  </Layout>
                </Protected>
              }
            />

            <Route
              path="/settings"
              element={
                <Protected roles={["Admin"]}>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </Protected>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
