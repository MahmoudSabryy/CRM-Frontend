import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL, myHeaders } from "../../Environment/environment";
import { AuthContext } from "../../Context/Auth Context/AuthContext";
import { ThemeContext } from "../../Context/Theme/ThemeContext";

export default function ContactDetails() {
  const { id } = useParams();
  const { userData } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({});

  const getSingleContact = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/contact/single/${id}`, {
        headers: myHeaders,
      });
      setContact(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error.response);
    }
  }, [id]);

  useEffect(() => {
    getSingleContact();
  }, [getSingleContact]);

  if (!contact) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const bgBase = darkMode
    ? "bg-gray-900 text-gray-200"
    : "bg-gray-100 text-gray-900";
  const cardBg = darkMode
    ? "bg-gray-800 text-gray-200"
    : "bg-white text-gray-900";
  const inputBg = darkMode
    ? "bg-gray-700 text-gray-200 border-gray-600"
    : "bg-white text-gray-900 border-gray-300";

  return (
    <div className={`min-h-screen ${bgBase}`}>
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-10 shadow px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {contact.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{contact.name}</h2>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`tel:${contact.phone}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Call
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Email
          </a>

          {userData?.role === "Admin" && (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-900"}`}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="border-b mb-6 flex gap-6">
          {["overview", "activity", "deals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl shadow ${cardBg}`}>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <p>Address: {contact.address || "not Provided"}</p>
            </div>

            <div className={`p-6 rounded-xl shadow ${cardBg}`}>
              <h3 className="font-semibold mb-4">Company Info</h3>
              <p>Company: {contact.company || "N/A"}</p>
              <p>Industry: {contact.industry || "N/A"}</p>
              <p>Owner: {contact.owner?.name || "Unassigned"}</p>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className={`p-6 rounded-xl shadow space-y-6 ${cardBg}`}>
            {contact.activities?.length ? (
              contact.activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border-l-4 pl-4 ${darkMode ? "border-blue-500" : "border-blue-500"}`}
                >
                  <p className="font-medium">{activity.type}</p>
                  <p className="font-medium">{activity.note}</p>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {activity.activityDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No activity found.</p>
            )}
          </div>
        )}

        {activeTab === "deals" && (
          <div className={`p-6 rounded-xl shadow overflow-x-auto ${cardBg}`}>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}
                >
                  <th className="p-3 text-left">Deal</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Stage</th>
                  <th className="p-3 text-left">Probability</th>
                  <th className="p-3 text-left">Expected Close Date</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {contact.deals?.length ? (
                  contact.deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className={`border-b hover:${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                    >
                      <td className="p-3">{deal.title}</td>
                      <td className="p-3">${deal.amount}</td>
                      <td className="p-3">{deal.status}</td>
                      <td className="p-3">{deal.stage}</td>
                      <td className="p-3">{deal.probability}%</td>
                      <td className="p-3">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {new Date(deal.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            deal.status === "Closed"
                              ? darkMode
                                ? "bg-green-700 text-green-200"
                                : "bg-green-100 text-green-600"
                              : darkMode
                                ? "bg-yellow-700 text-yellow-200"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {deal.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-3 text-gray-400 text-center">
                      No deals available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div
            className={`p-8 rounded-xl w-full max-w-md ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}
          >
            <h3 className="text-lg font-bold mb-4">Edit Contact</h3>

            <input
              type="text"
              defaultValue={contact.name}
              className={`w-full p-2 rounded mb-4 border ${inputBg}`}
            />
            <input
              type="email"
              defaultValue={contact.email}
              className={`w-full p-2 rounded mb-4 border ${inputBg}`}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2 rounded ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-300 text-gray-900"}`}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
