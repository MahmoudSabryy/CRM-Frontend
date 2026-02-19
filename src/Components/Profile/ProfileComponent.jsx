import React, { useState, useEffect } from "react";

export default function ProfileComponent({ userData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(userData);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Profile...
      </div>
    );

  const isAdmin = user.role === "Admin";

  const handleSave = () => {
    setLoading(true);

    // simulate API request
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
    }, 1500);
  };

  return (
    <div
      className={`${darkMode ? "dark bg-gray-900" : "bg-gray-100"} min-h-screen p-6 transition-all`}
    >
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-40 relative">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white absolute left-8 top-20 object-cover"
          />
        </div>

        <div className="pt-16 px-8 pb-8">
          {/* Top Controls */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                  user.role === "Admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {user?.role}
              </span>

              <p className="text-gray-500 dark:text-gray-300 mt-2">
                {user?.email}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {isAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { label: "Total Deals", value: user?.stats?.deals },
              { label: "Revenue", value: `$${user?.stats?.revenue}` },
              { label: "Pending Tasks", value: user?.stats?.tasks },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm text-center"
              >
                <h3 className="text-lg font-bold">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b flex space-x-6">
            {["overview", "activity", "deals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "overview" && (
              <p className="leading-relaxed">{user?.bio}</p>
            )}

            {activeTab === "activity" && (
              <ul className="space-y-4">
                {user?.activity?.map((item, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "deals" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3">Deal</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user?.deals?.map((deal, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-3">{deal.name}</td>
                        <td className="p-3">{deal.client}</td>
                        <td className="p-3">${deal.amount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              deal.status === "Closed"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>

            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
