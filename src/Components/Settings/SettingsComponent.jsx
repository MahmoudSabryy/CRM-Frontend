import { useState } from "react";

export default function SettingsComponent() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 bg-white shadow rounded-xl p-4">
          <ul className="space-y-2">
            {[
              { id: "profile", label: "Profile" },
              { id: "security", label: "Security" },
              { id: "notifications", label: "Notifications" },
              { id: "appearance", label: "Appearance" },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white shadow rounded-xl p-6">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mt-6">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  "Email Notifications",
                  "SMS Notifications",
                  "Push Notifications",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <span>{item}</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-purple-600"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Appearance</h2>

              <div className="flex gap-4">
                <button className="flex-1 border rounded-lg p-4 hover:border-purple-600">
                  ☀️ Light Mode
                </button>

                <button className="flex-1 border rounded-lg p-4 hover:border-purple-600">
                  🌙 Dark Mode
                </button>
              </div>

              <div className="mt-6">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                  Apply Theme
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
