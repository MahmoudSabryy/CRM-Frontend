import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import {
  FiPhone,
  FiMail,
  FiCalendar,
  FiFileText,
  FiUser,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import { LeadContext } from "../../Context/LeadContext/lead.context";
import { baseURL, myHeaders } from "../../Environment/environment";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddActivityFormLead from "../Forms/AddActivityFormLead";
import EditLeadForm from "../Forms/EditLeadForm";
import { confirmAlert } from "../../Utils/confirmAlert";

export default function LeadDetails() {
  const { getAllLeads } = useContext(LeadContext);
  const navigate = useNavigate();
  const stages = ["new", "contacted", "qualified", "unqualified"];
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const getSingleLead = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/lead/single/${id}`, {
        headers: myHeaders,
      });
      setLead(data.data);
      setSelectedLeadId(data.data.id);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getSingleLead();
  }, [getSingleLead]);

  const convertLeadTOContact = async (lead) => {
    try {
      await axios.post(
        `${baseURL}/contact/convert/${lead.id}`,
        { lead },
        {
          headers: myHeaders,
        },
      );

      toast.success(`Lead Converted Succssfully ✔`);

      getAllLeads();
      navigate("/contact");
    } catch (error) {
      console.log(error.response);

      toast.error(error.response.data.message);
    }
  };

  const handleStageChange = async (result) => {
    const { destination } = result;
    if (!destination) return;

    const newStage = destination.droppableId;
    if (newStage === lead.status) return;

    try {
      await axios.patch(
        `${baseURL}/lead/status/${lead.id}`,
        { status: newStage },
        { headers: myHeaders },
      );
      setLead({ ...lead, status: newStage });
      toast.success("Stage updated ✔");
    } catch {
      toast.error("Failed to update stage");
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await axios.delete(`${baseURL}/activity/delete/${activityId}`, {
        headers: myHeaders,
      });
      setLead({
        ...lead,
        activities: lead.activities.filter((a) => a.id !== activityId),
      });
      toast.success("Activity Deleted Successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const activityIcon = (type) => {
    switch (type) {
      case "call":
        return <FiPhone />;
      case "email":
        return <FiMail />;
      case "meeting":
        return <FiCalendar />;
      default:
        return <FiFileText />;
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!lead) return <p className="p-6">Lead not found</p>;

  /* KPI */
  const totalActivities = lead.activities.length;
  const calls = lead.activities.filter((a) => a.type === "call").length;
  const emails = lead.activities.filter((a) => a.type === "email").length;
  const meetings = lead.activities.filter((a) => a.type === "meeting").length;
  const followUps = lead.activities.filter(
    (a) => a.type === "follow-up",
  ).length;

  return (
    <div className="p-8 bg-gray-50 dark:bg-black min-h-screen">
      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-6"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
              <FiUser />{" "}
              {lead.name.charAt(0).toUpperCase() + lead.name.slice(1)}
            </h1>
            <p className="text-gray-500">Email: {lead.email}</p>
            <p className="text-gray-500">Phone: {lead.phone}</p>
            <p className="text-gray-500">Source: {lead.source}</p>
            <p className="mt-2 capitalize">
              Status: <span className="text-gray-500">{lead.status}</span>
            </p>
            <p className="mt-2 capitalize">
              Sales Person:{" "}
              <span className="text-gray-500">{lead?.owner?.name}</span>
            </p>
            <p className="mt-2 capitalize">
              Created At:{" "}
              <span className="text-gray-500">
                {new Date(lead.createdAt).toLocaleString()}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditLeadModalOpen(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-xl flex items-center gap-2"
            >
              <FiEdit /> Edit
            </button>

            <button
              onClick={async () => {
                const confirmed = await confirmAlert({
                  title: "Convert Lead",
                  text: "Are you sure you want to convert this lead to a contact?",
                  confirmText: "Yes, Convert",
                  cancelText: "No, Cancel",
                  icon: "question",
                });

                if (confirmed) {
                  convertLeadTOContact(lead);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              Convert
            </button>
          </div>
        </div>
      </motion.div>

      {/* STAGE DRAG SECTION */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Change Stage</h2>
        <DragDropContext onDragEnd={handleStageChange}>
          <div className="flex gap-4 overflow-x-auto">
            {stages.map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-60 min-h-[120px] p-4 rounded-xl border-2 transition ${
                      snapshot.isDraggingOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <h3 className="font-semibold capitalize mb-3 dark:text-white">
                      {stage}
                    </h3>

                    {lead.status === stage && (
                      <Draggable draggableId={lead.id.toString()} index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-xl shadow cursor-pointer transition ${
                              snapshot.isDragging
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                            }`}
                          >
                            {lead.name}
                          </div>
                        )}
                      </Draggable>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
          <p>Total Activities</p>
          <h3 className="text-2xl font-bold">{totalActivities}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
          <p>Calls</p>
          <h3 className="text-2xl font-bold text-blue-500">{calls}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
          <p>Emails</p>
          <h3 className="text-2xl font-bold text-purple-500">{emails}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
          <p>Meetings</p>
          <h3 className="text-2xl font-bold text-green-500">{meetings}</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
          <p>Follow-ups</p>
          <h3 className="text-2xl font-bold text-yellow-500">{followUps}</h3>
        </div>
      </div>

      {/* ACTIVITY TIMELINE */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">
            Activity Timeline
          </h2>
          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            + Add Activity
          </button>
        </div>

        <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4">
          {lead.activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 ml-6"
            >
              <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
                {activityIcon(activity.type)}
              </span>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
                <div className="flex justify-between">
                  <p className="font-semibold capitalize">{activity.type}</p>
                  <button
                    onClick={async () => {
                      const confirmed = await confirmAlert({
                        title: "Delete Activity",
                        message:
                          "Are you sure you want to delete this activity?",
                        confirmText: "Yes, Delete",
                        cancelText: "No, Cancel",
                        icon: <FiTrash2 className="text-red-500" />,
                      });

                      if (confirmed) deleteActivity(activity.id);
                    }}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">{activity.notes}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EDIT LEAD DRAWER */}
      {isEditLeadModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsEditLeadModalOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 p-8 overflow-auto"
          >
            <h2 className="text-xl font-semibold mb-6">Edit Lead</h2>

            <EditLeadForm
              selectedLead={lead}
              setIsDrawerOpen={setIsEditLeadModalOpen}
              onSubmit={getSingleLead}
            />
          </motion.div>
        </>
      )}

      {/* ADD ACTIVITY DRAWER */}
      {isAddActivityOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsAddActivityOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 p-8 overflow-auto"
          >
            <h2 className="text-xl font-semibold mb-6">Add Activity</h2>

            <AddActivityFormLead
              selectedLeadId={selectedLeadId}
              setSelectedLeadId={setSelectedLeadId}
              setIsAddActivityOpen={setIsAddActivityOpen}
              getSingleLead={getSingleLead}
              onSubmit={getSingleLead}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
