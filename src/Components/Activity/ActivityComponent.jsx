import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";

const activityTypes = {
  call: { label: "Call", icon: "📞", color: "bg-blue-500" },
  meeting: { label: "Meeting", icon: "📅", color: "bg-purple-500" },
  email: { label: "Email", icon: "✉️", color: "bg-green-500" },
  note: { label: "Note", icon: "📝", color: "bg-yellow-500" },
  task: { label: "Task", icon: "✅", color: "bg-pink-500" },
};

// دالة لتحديد لون الكارد حسب تاريخ النشاط
const getActivityBackground = (createdAt) => {
  const now = new Date();
  const activityDate = new Date(createdAt);
  const diffTime = now - activityDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return "bg-green-50";
  if (diffDays <= 7) return "bg-yellow-50";
  return "bg-gray-50";
};

export default function ActivityComponent({ userData }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedContact, setSelectedContact] = useState("all");

  const getAllUserActivities = async () => {
    try {
      let url = `${baseURL}/activity/user`;
      const { data } = await axios.get(url, { headers: myHeaders });

      // للآدمن كل الأنشطة، لليوزر العادي فلترة على نفسه
      if (userData.role === "admin") {
        setUserActivities(data.data);
      } else {
        setUserActivities(
          data.data.filter((act) => act.user?.id === userData.id),
        );
      }
    } catch (error) {
      console.log(error.response || error);
    }
  };

  useEffect(() => {
    getAllUserActivities();
  }, []);

  // Dropdown users: Admin يشوف كل المستخدمين، واليوزر العادي يشوف نفسه فقط
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Activity Timeline</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder("recent")}
            className={`px-3 py-1 rounded-full text-sm ${
              sortOrder === "recent" ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
          >
            Recent First
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`px-3 py-1 rounded-full text-sm ${
              sortOrder === "oldest" ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
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
        className="w-full mb-4 p-2 border rounded-lg"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === "all" ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>

        {Object.keys(activityTypes).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === type ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
          >
            {activityTypes[type].icon} {activityTypes[type].label}
          </button>
        ))}

        {/* User dropdown */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-1 rounded-lg border text-sm"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Contact dropdown */}
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="px-3 py-1 rounded-lg border text-sm"
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
      <div className="relative border-l-2 border-gray-200 pl-6 space-y-8">
        {filteredActivities.map((activity) => {
          const typeInfo = activityTypes[activity.type] || {
            label: "Unknown",
            icon: "❔",
            color: "bg-gray-400",
          };
          return (
            <div key={activity.id} className="relative group">
              <div
                className={`absolute -left-4 top-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${typeInfo.color}`}
              >
                {typeInfo.icon}
              </div>

              <div
                className={`p-5 rounded-xl shadow-sm hover:shadow-md transition ${getActivityBackground(
                  activity.createdAt,
                )}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {typeInfo.label}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1">
                      {activity.note}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                    {activity.contact && (
                      <p className="text-xs text-gray-500 mt-1">
                        Contact: {activity.contact.name} (
                        {activity.contact.company})
                      </p>
                    )}
                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">
                        By: {activity.user.name}
                      </p>
                    )}
                  </div>
                </div>

                {activity.note && activity.note.length > 50 && (
                  <div className="mt-3">
                    <p
                      className={`text-sm text-gray-600 transition-all ${
                        expanded === activity.id ? "" : "line-clamp-1"
                      }`}
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
          <p className="text-gray-400 text-center">No activities found.</p>
        )}
      </div>
    </div>
  );
}
