import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL, myHeaders } from "../../Environment/environment";
import { confirmAlert } from "../../Utils/confirmAlert";

const stageColors = {
  prospecting: "bg-slate-100 text-slate-600",
  proposal: "bg-blue-100 text-blue-600",
  negotiation: "bg-yellow-100 text-yellow-600",
  won: "bg-green-100 text-green-600",
  lost: "bg-red-100 text-red-600",
};

const stageProgress = {
  prospecting: 15,
  proposal: 40,
  negotiation: 75,
  won: 100,
  lost: 100,
};

export default function DealDetailsComponent({ userData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getDeal = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/deal/single/${id}`, {
        headers: myHeaders,
      });
      setDeal(data.data);
    } catch (error) {
      toast.error("Failed to load deal");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteDeal = async () => {
    const confirmed = await confirmAlert({
      title: "Delete Deal?",
      text: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      await axios.delete(`${baseURL}/deal/delete/${id}`, {
        headers: myHeaders,
      });
      toast.success("Deal deleted ✔");
      navigate("/deal");
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    getDeal();
  }, [getDeal, id]);

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!deal) return null;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{deal.title}</h2>
          <span
            className={`px-3 py-1 text-xs rounded-full capitalize ${stageColors[deal.stage]}`}
          >
            {deal.stage}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Edit
          </button>

          {userData?.role === "Admin" && (
            <button
              onClick={deleteDeal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Progress */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-slate-500 mb-2">Deal Progress</p>
          <div className="w-full bg-slate-200 h-3 rounded">
            <div
              className="h-3 bg-indigo-600 rounded"
              style={{ width: `${stageProgress[deal.stage]}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-3">
          {["overview", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                  : "text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Deal Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                Deal Information
              </h3>

              <div className="grid grid-cols-2 gap-y-5 text-sm">
                <div>
                  <p className="text-slate-500">Amount</p>
                  <p className="font-semibold text-slate-800 text-base">
                    ${deal.amount}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Expected Close</p>
                  <p className="font-medium text-slate-700">
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Created At</p>
                  <p className="font-medium text-slate-700">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Owner</p>
                  <p className="font-medium text-slate-700">
                    {deal.owner?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 mb-2">Probability</p>
                  <div className="w-full bg-slate-200 h-2 rounded">
                    <div
                      className="h-2 bg-indigo-600 rounded transition-all"
                      style={{ width: `${deal.probability || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {deal.probability || 0}%
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Status</p>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      deal.status === "active"
                        ? "bg-green-100 text-green-600"
                        : deal.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Stage</p>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                      deal.stage === "won"
                        ? "bg-green-100 text-green-600"
                        : deal.stage === "lost"
                          ? "bg-red-100 text-red-600"
                          : deal.stage === "negotiation"
                            ? "bg-yellow-100 text-yellow-600"
                            : deal.stage === "proposal"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {deal.stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}

            <Link
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              to={`/contact/${deal.contact?.id}`}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                Related Contact
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {deal.contact?.name?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {deal.contact?.name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {deal.contact?.company || "No Company"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-700">
                    {deal.contact?.email || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-700">
                    {deal.contact?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Activity */}
        {activeTab === "activity" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {deal.activities?.length ? (
              deal.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-indigo-500 pl-4"
                >
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-slate-500">{activity.note}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(activity.activityDate).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No activity yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Deal</h3>

            <input
              defaultValue={deal.title}
              className="w-full p-2 border rounded mb-4"
            />

            <input
              type="number"
              defaultValue={deal.amount}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-indigo-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
