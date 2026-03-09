import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";
import { AuthContext } from "../../Context/Auth Context/AuthContext";
import AddActivityDrawer from "../Forms/AddActivityForm";
import { ThemeContext } from "../../Context/Theme/ThemeContext"; // Dark mode context

const activityTypes = {
  call: { label: "Call", icon: "📞", color: "bg-blue-500" },
  meeting: { label: "Meeting", icon: "📅", color: "bg-purple-500" },
  email: { label: "Email", icon: "✉️", color: "bg-green-500" },
  followUp: { label: "Follow-up", icon: "🔄", color: "bg-yellow-500" },
};

const getActivityBackground = (createdAt, darkMode) => {
  const now = new Date();
  const activityDate = new Date(createdAt);
  const diffTime = now - activityDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return darkMode ? "bg-green-900/30" : "bg-green-50";
  if (diffDays <= 7) return darkMode ? "bg-yellow-900/30" : "bg-yellow-50";
  return darkMode ? "bg-gray-800" : "bg-gray-50";
};

export default function ActivityComponent() {
  const { userData } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedContact, setSelectedContact] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [isAddActivityDrawer, setIsAddActivityDrawer] = useState(false);

  const getAllUserActivities = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/activity/user`, {
        headers: myHeaders,
      });
      if (userData.role === "admin") setUserActivities(data.data);
      else
        setUserActivities(
          data.data.filter((act) => act.user?.id === userData.id),
        );
    } catch (error) {
      console.log(error.response || error);
    }
  }, [userData]);

  useEffect(() => {
    getAllUserActivities();
  }, [getAllUserActivities]);

  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`${baseURL}/activity/delete/${id}`, {
        headers: myHeaders,
      });
      setUserActivities((prev) => prev.filter((act) => act.id !== id));
    } catch (error) {
      console.log(error.response || error);
    }
  };

  const handleEditActivity = async (id) => {
    try {
      await axios.put(
        `${baseURL}/activity/${id}`,
        { note: editNote },
        { headers: myHeaders },
      );
      setUserActivities((prev) =>
        prev.map((act) => (act.id === id ? { ...act, note: editNote } : act)),
      );
      setEditId(null);
      setEditNote("");
    } catch (error) {
      console.log(error.response || error);
    }
  };

  const uniqueUsers =
    userData.role === "admin"
      ? [
          ...new Map(
            userActivities.map((act) => [act.user?.id, act.user]),
          ).values(),
        ].filter(Boolean)
      : [userData];

  const uniqueContacts = [
    ...new Map(
      userActivities.map((act) => [act.contact?.id, act.contact]),
    ).values(),
  ].filter(Boolean);

  const filteredActivities = userActivities
    .filter((act) => (filter === "all" ? true : act.type === filter))
    .filter((act) => act.note?.toLowerCase().includes(search?.toLowerCase()))
    .filter((act) =>
      selectedUser === "all" ? true : act.user?.id === selectedUser,
    )
    .filter((act) =>
      selectedContact === "all" ? true : act.contact?.id === selectedContact,
    )
    .sort((a, b) =>
      sortOrder === "recent"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  return (
    <div
      className={`rounded-2xl shadow-xl p-6 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Activity Timeline</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddActivityDrawer(true)}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#7c3aed" }}
          >
            ➕ Add Activity
          </button>
          <button
            onClick={() => setSortOrder("recent")}
            className={`px-3 py-1 rounded-full text-sm ${sortOrder === "recent" ? "bg-gray-800 text-white" : darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"}`}
          >
            Recent First
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1 rounded-full text-sm ${sortOrder === "oldest" ? "bg-gray-800 text-white" : darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"}`}
          >
            Oldest First
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search activity..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg border"
        style={{
          backgroundColor: darkMode ? "#2c2c3a" : "#fff",
          color: darkMode ? "#f0f0f0" : "#111827",
          borderColor: darkMode ? "#444" : "#d1d5db",
        }}
      />

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm ${filter === "all" ? "bg-gray-800 text-white" : darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"}`}
        >
          All
        </button>
        {Object.keys(activityTypes).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-sm ${filter === type ? "bg-gray-800 text-white" : darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"}`}
          >
            {activityTypes[type].icon} {activityTypes[type].label}
          </button>
        ))}
        {userData.role === "admin" && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-1 rounded-lg border text-sm"
            style={{
              backgroundColor: darkMode ? "#2c2c3a" : "#fff",
              color: darkMode ? "#f0f0f0" : "#111827",
              borderColor: darkMode ? "#444" : "#d1d5db",
            }}
          >
            <option value="all">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="px-3 py-1 rounded-lg border text-sm"
          style={{
            backgroundColor: darkMode ? "#2c2c3a" : "#fff",
            color: darkMode ? "#f0f0f0" : "#111827",
            borderColor: darkMode ? "#444" : "#d1d5db",
          }}
        >
          <option value="all">All Contacts</option>
          {uniqueContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name} ({contact.company})
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div
        className="relative border-l-2 pl-6"
        style={{ borderColor: darkMode ? "#555" : "#e5e7eb" }}
      >
        {filteredActivities.map((activity) => {
          const typeInfo = activityTypes[activity.type] || {
            label: "Unknown",
            icon: "❔",
            color: "bg-gray-400",
          };
          return (
            <div key={activity.id} className="relative group mb-8">
              <div
                className={`absolute -left-4 top-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${typeInfo.color}`}
              >
                {typeInfo.icon}
              </div>
              <div
                className={`p-5 rounded-xl shadow-sm transition ${getActivityBackground(activity.createdAt, darkMode)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase">
                      {typeInfo.label}
                    </span>
                    {editId === activity.id ? (
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        style={{
                          backgroundColor: darkMode ? "#2c2c3a" : "#fff",
                          color: darkMode ? "#f0f0f0" : "#111827",
                        }}
                      />
                    ) : (
                      <h3 className="font-semibold mt-1">{activity.note}</h3>
                    )}
                    <p className="text-xs mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                    {activity.contact && (
                      <p className="text-xs mt-1">
                        Contact: {activity.contact.name} (
                        {activity.contact.phone})
                      </p>
                    )}
                    {activity.user && (
                      <p className="text-xs mt-1">By: {activity.user.name}</p>
                    )}
                    {activity.lead && (
                      <p className="text-xs mt-1">
                        Lead: {activity.lead.name} ({activity.lead.phone})
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    {editId === activity.id ? (
                      <>
                        <button
                          onClick={() => handleEditActivity(activity.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-xs"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(activity.id);
                            setEditNote(activity.note);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {activity.note && activity.note.length > 50 && (
                  <div className="mt-3">
                    <p
                      className={`text-sm transition-all ${expanded === activity.id ? "" : "line-clamp-1"}`}
                    >
                      {activity.note}
                    </p>
                    <button
                      onClick={() =>
                        setExpanded(
                          expanded === activity.id ? null : activity.id,
                        )
                      }
                      className="text-blue-600 text-xs mt-1"
                    >
                      {expanded === activity.id ? "Show Less" : "Read More"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filteredActivities.length === 0 && (
          <p className="text-center text-gray-400">No activities found.</p>
        )}
      </div>

      {/* Add Activity Drawer */}
      {isAddActivityDrawer && (
        <div className="fixed inset-0 flex justify-end bg-black/30 backdrop-blur-sm">
          <div
            className={`w-96 h-full p-6 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white"}`}
          >
            <h2 className="text-xl font-bold mb-4">Add Activity</h2>
            <AddActivityDrawer
              isAddActivityDrawer={isAddActivityDrawer}
              setIsAddActivityDrawer={setIsAddActivityDrawer}
              onSubmit={(data) => console.log("Submitted data:", data)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
