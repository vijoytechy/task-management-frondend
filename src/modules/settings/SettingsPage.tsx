import { useState } from "react";
import { RolesManagement } from "../roles/RolesManagement";
import { UserManagement } from "../users/UserManagement";


export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 -mb-px font-medium border-b-2 ${
            activeTab === "roles"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Roles Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 -mb-px font-medium border-b-2 ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Users Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "roles" && <RolesManagement />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
}
