import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, ready, hasRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route/content interactions via Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 bg-white border-r p-4 flex-col">
        <div>
          <h1 className="text-xl font-semibold mb-6">Task Manager</h1>

          {/* Visible to all logged-in users */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          {/*  Tasks — accessible to all roles */}
          {hasRole(["Admin", "Developer", "Manager", "User"]) && (
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""
                }`
              }
            >
              Tasks
            </NavLink>
          )}



          {/*  Settings — Admin   */}
          {hasRole(["Admin"]) && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""
                }`
              }
            >
              Settings
            </NavLink>
          )}
        </div>

        {/*  User info + Logout */}
        <div className="mt-auto pt-6 border-t">
          {user ? (
            <div className="flex items-center space-x-3 mb-3">
              {/* Bigger avatar for sidebar */}
              <Avatar name={user.name} size={40} />

              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-[140px]">
                  {user.email}
                </span>
                <span className="text-xs text-gray-400">
                  Role: {user.role?.name || "N/A"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">Not logged in</p>
          )}

          <button
            onClick={logout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded transition"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed inset-x-0 top-0 z-40 bg-white border-b">
        <div className="h-14 flex items-center justify-between px-4">
          <button
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded border hover:bg-gray-50"
          >
            {/* Hamburger */}
            <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-700"></span>
          </button>
          <h1 className="text-base font-semibold">Task Manager</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Mobile drawer sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="w-64 max-w-[80%] h-full bg-white border-l p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded border hover:bg-gray-50"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""}`
                }
              >
                Dashboard
              </NavLink>

              {hasRole(["Admin", "Developer", "Manager", "User"]) && (
                <NavLink
                  to="/tasks"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""}`
                  }
                >
                  Tasks
                </NavLink>
              )}

              {hasRole(["Admin"]) && (
                <NavLink
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-blue-100" : ""}`
                  }
                >
                  Settings
                </NavLink>
              )}
            </div>

            <div className="mt-auto pt-6 border-t">
              {user ? (
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar name={user.name} size={36} />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[140px]">
                      {user.email}
                    </span>
                    <span className="text-xs text-gray-400">
                      Role: {user.role?.name || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">Not logged in</p>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 w-full md:ml-0 pt-16 md:pt-8">{children}</main>
    </div>
  );
}
