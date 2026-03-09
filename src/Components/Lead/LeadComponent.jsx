import { useContext, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { LeadContext } from "../../Context/LeadContext/lead.context";
import { baseURL, myHeaders } from "../../Environment/environment";
import { confirmAlert } from "../../Utils/confirmAlert";
import AddLeadForm from "../Forms/AddLeadForm";
import EditLeadForm from "../Forms/EditLeadForm";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../Context/Auth Context/AuthContext";

const statuses = ["new", "contacted", "qualified", "unqualified"];

export default function LeadComponent() {
  const { userData } = useContext(AuthContext);

  const navigate = useNavigate();
  const { leads, softDeleteLead, setLeads } = useContext(LeadContext);

  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (!search) return true;
      return (
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.includes(search)
      );
    });
  }, [leads, search]);

  const grouped = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = filteredLeads.filter((lead) => lead.status === status);
      return acc;
    }, {});
  }, [filteredLeads]);

  // KPI
  const totalLeads = leads.length;
  const qualified = leads.filter((l) => l.status === "qualified").length;
  const unqualified = leads.filter((l) => l.status === "unqualified").length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contacted = leads.filter((l) => l.status === "contacted").length;

  // Drag & Drop
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const prevLeads = [...leads];
    const updated = leads.map((lead) =>
      lead.id.toString() === draggableId
        ? { ...lead, status: destination.droppableId }
        : lead,
    );

    setLeads(updated);

    try {
      await axios.patch(
        `${baseURL}/lead/status/${draggableId}`,
        { status: destination.droppableId },
        { headers: myHeaders },
      );
      toast.success("Status updated Successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      setLeads(prevLeads);
    }
  };

  const statusColors = {
    new: "bg-gray-200 dark:bg-gray-700",
    contacted: "bg-blue-200 dark:bg-blue-800",
    qualified: "bg-green-200 dark:bg-green-800",
    unqualified: "bg-red-200 dark:bg-red-800",
  };

  return (
    <>
      <div className="p-6 bg-gray-50 dark:bg-black min-h-screen">
        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          {/* Total Leads */}
          <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-xl shadow border-l-4 border-gray-500">
            <h4 className="text-gray-600 dark:text-gray-300 text-sm">
              Total Leads
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {totalLeads}
            </p>
          </div>

          {/* New Leads */}
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow border-l-4 border-gray-500">
            <h4 className="text-blue-600 dark:text-blue-300 text-sm">
              New Leads
            </h4>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
              {newLeads}
            </p>
          </div>

          {/* Contacted */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow border-l-4 border-blue-500">
            <h4 className="text-purple-600 dark:text-purple-300 text-sm">
              Contacted
            </h4>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
              {contacted}
            </p>
          </div>

          {/* Qualified */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl shadow border-l-4 border-green-500">
            <h4 className="text-green-600 dark:text-green-300 text-sm">
              Qualified
            </h4>
            <p className="text-2xl font-bold text-green-700 dark:text-green-200">
              {qualified}
            </p>
          </div>

          {/* Unqualified */}
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl shadow border-l-4 border-red-500">
            <h4 className="text-red-600 dark:text-red-300 text-sm">
              Unqualified
            </h4>
            <p className="text-2xl font-bold text-red-700 dark:text-red-200">
              {unqualified}
            </p>
          </div>

          {/* Search */}
          <div className="md:col-span-2 flex items-center justify-end gap-4">
            <input
              placeholder="Search..."
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto">
            {statuses.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-80 min-h-[500px] p-4 rounded-2xl ${statusColors[status]}`}
                  >
                    <div className="flex justify-between mb-4">
                      <h2 className="font-bold capitalize">{status}</h2>
                      <button
                        onClick={() => {
                          setDrawerMode("add");
                          setSelectedLead(null);
                          setIsDrawerOpen(true);
                        }}
                        className="text-sm text-blue-600"
                      >
                        + Add
                      </button>
                    </div>

                    {grouped[status].map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-3 rounded-xl shadow-md transition ${
                              snapshot.isDragging
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-gray-800 dark:text-white"
                            }`}
                          >
                            <Link
                              to={`/lead/${lead.id}`}
                              className="block bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 transition-all rounded-lg px-3 py-2"
                            >
                              <div className="flex items-center gap-3">
                                {/* Small Avatar */}
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                                  {lead.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                                    {lead.name?.charAt(0).toUpperCase() +
                                      lead.name?.slice(1)}
                                  </h3>

                                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-3">
                                    <span className="truncate">
                                      {lead.email?.toLowerCase()}
                                    </span>
                                    <span>{lead.phone}</span>
                                    <span className="text-gray-400">
                                      {lead.owner?.name || "Unassigned"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <div className="flex justify-between mt-3 text-xs">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setDrawerMode("edit");
                                  setIsDrawerOpen(true);
                                }}
                                className="text-yellow-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => navigate(`/lead/${lead.id}`)}
                                className="text-blue-500"
                              >
                                View Details
                              </button>

                              {userData?.role === "admin" && (
                                <button
                                  onClick={async () => {
                                    const confirmed = await confirmAlert({
                                      title: "Delete lead?",
                                      confirmText: "Delete",
                                      cancelText: "Cancel",
                                      icon: "warning",
                                    });
                                    if (confirmed) softDeleteLead(lead.id);
                                  }}
                                  className="text-red-500"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          onClick={(e) => e.stopPropagation()} // منع غلق Drawer عند الضغط داخله
          className={`absolute right-0 top-0 h-full w-[520px] bg-white dark:bg-gray-800 shadow-2xl p-8 overflow-auto transform transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6">
            {drawerMode === "add" ? "Add Lead" : "Edit Lead"}
          </h2>

          {drawerMode === "add" ? (
            <AddLeadForm
              setIsDrawerOpen={setIsDrawerOpen}
              onSubmit={() => setIsDrawerOpen(false)}
            />
          ) : (
            <EditLeadForm
              selectedLead={selectedLead}
              setIsDrawerOpen={setIsDrawerOpen}
              onSubmit={() => setIsDrawerOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}
