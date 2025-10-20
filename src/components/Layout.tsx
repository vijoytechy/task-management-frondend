import { NavLink } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, ready, hasRole } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-4 flex flex-col">
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

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
