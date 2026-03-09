import { useEffect, useMemo, useState, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { baseURL, myHeaders } from "../../Environment/environment";
import EditDealForm from "../Forms/EditDealForm";
import AddDealForm from "../Forms/AddDealForm";
import toast from "react-hot-toast";
import axios from "axios";
import { confirmAlert } from "../../Utils/confirmAlert";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/Theme/ThemeContext"; // Theme context

const stages = ["prospecting", "proposal", "negotiation", "won", "lost"];

export default function DealComponent() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortByAmount, setSortByAmount] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedDeal, setSelectedDeal] = useState(null);

  const getAllDeals = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/deal`, {
        headers: myHeaders,
      });
      setDeals(data.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  const deleteDeal = async (id) => {
    try {
      await axios.delete(`${baseURL}/deal/delete/${id}`, {
        headers: myHeaders,
      });
      toast.success("Deal deleted ✔");
      getAllDeals();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const deal = deals.find((d) => d.id.toString() === result.draggableId);
    if (!deal) return;
    try {
      await axios.put(
        `${baseURL}/deal/update/${deal.id}`,
        { stage: destination.droppableId },
        { headers: myHeaders },
      );
      toast.success(`Moved to ${destination.droppableId}`);
      getAllDeals();
    } catch {
      toast.error("Failed to update stage");
    }
  };

  useEffect(() => {
    getAllDeals();
  }, []);

  const processedDeals = useMemo(() => {
    let filtered = [...deals];
    if (search)
      filtered = filtered.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterStage !== "all")
      filtered = filtered.filter((d) => d.stage === filterStage);
    if (sortByAmount) filtered.sort((a, b) => b.amount - a.amount);
    return filtered;
  }, [deals, search, filterStage, sortByAmount]);

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = processedDeals.filter((d) => d.stage === stage);
    return acc;
  }, {});

  const totalRevenue = deals.reduce((sum, d) => sum + d.amount, 0);
  const wonRevenue = deals
    .filter((d) => d.stage === "won")
    .reduce((sum, d) => sum + d.amount, 0);

  const stageColors = {
    prospecting: darkMode
      ? "bg-slate-700 text-slate-200"
      : "bg-slate-100 text-slate-600",
    proposal: darkMode
      ? "bg-blue-800 text-blue-200"
      : "bg-blue-100 text-blue-600",
    negotiation: darkMode
      ? "bg-yellow-800 text-yellow-200"
      : "bg-yellow-100 text-yellow-600",
    won: darkMode
      ? "bg-green-800 text-green-200"
      : "bg-green-100 text-green-600",
    lost: darkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-600",
  };

  const stageProgress = (stage) => {
    switch (stage) {
      case "prospecting":
        return 15;
      case "proposal":
        return 40;
      case "negotiation":
        return 75;
      case "won":
        return 100;
      case "lost":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ backgroundColor: darkMode ? "#1e1e2f" : "#f8fafc" }}
    >
      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Deals" value={deals.length} darkMode={darkMode} />
        <KpiCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
          darkMode={darkMode}
        />
        <KpiCard
          title="Won Deals"
          value={deals.filter((d) => d.stage === "won").length}
          darkMode={darkMode}
        />
        <KpiCard
          title="Won Revenue"
          value={`$${wonRevenue}`}
          darkMode={darkMode}
        />
      </div>

      {/* Header Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl w-64"
          style={{
            backgroundColor: darkMode ? "#2c2c3a" : "#fff",
            color: darkMode ? "#f0f0f0" : "#111827",
            borderColor: darkMode ? "#444" : "#e5e7eb",
          }}
        />
        <div className="flex gap-3 flex-wrap">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2 border rounded-xl"
            style={{
              backgroundColor: darkMode ? "#2c2c3a" : "#fff",
              color: darkMode ? "#f0f0f0" : "#111827",
              borderColor: darkMode ? "#444" : "#e5e7eb",
            }}
          >
            <option value="all">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortByAmount(!sortByAmount)}
            className="px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: "#6366f1" }}
          >
            Sort by Amount
          </button>

          <button
            onClick={() => {
              setDrawerMode("add");
              setSelectedDeal(null);
              setIsDrawerOpen(true);
            }}
            className="px-5 py-2 rounded-xl text-white"
            style={{ backgroundColor: "#4f46e5" }}
          >
            + Add Deal
          </button>
        </div>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="rounded-2xl p-4 shadow-sm flex flex-col"
                  style={{
                    backgroundColor: darkMode ? "#2c2c3a" : "#fff",
                    minHeight: "500px",
                  }}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-center mb-4 font-semibold capitalize ${stageColors[stage]}`}
                  >
                    {stage} ({dealsByStage[stage]?.length})
                  </div>

                  {dealsByStage[stage]?.map((deal, index) => (
                    <Draggable
                      key={deal.id}
                      draggableId={deal.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="rounded-xl p-4 mb-3 shadow hover:shadow-md flex flex-col"
                          style={{
                            backgroundColor: darkMode ? "#2c2c3a" : "#fff",
                            border: `1px solid ${darkMode ? "#444" : "#e5e7eb"}`,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <h4 className="font-semibold">{deal.title}</h4>
                          <p
                            className="text-sm"
                            style={{ color: darkMode ? "#ccc" : "#6b7280" }}
                          >
                            {deal?.owner?.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: darkMode ? "#ccc" : "#6b7280" }}
                          >
                            ${deal.amount}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: darkMode ? "#ccc" : "#6b7280" }}
                          >
                            {new Date(deal.expectedCloseDate).toLocaleString()}
                          </p>

                          <div
                            className="w-full h-2 rounded mt-3 overflow-hidden"
                            style={{
                              backgroundColor: darkMode ? "#444" : "#e5e7eb",
                            }}
                          >
                            <div
                              className="h-2 rounded"
                              style={{
                                width: `${stageProgress(deal.stage)}%`,
                                background: darkMode
                                  ? "linear-gradient(90deg,#6366f1,#2563eb)"
                                  : "#6366f1",
                              }}
                            />
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2 mt-4 flex-wrap">
                            <button
                              onClick={() => {
                                setDrawerMode("edit");
                                setSelectedDeal(deal);
                                setIsDrawerOpen(true);
                              }}
                              className="px-3 py-1 rounded-lg text-white flex-1 min-w-[70px] text-center"
                              style={{ backgroundColor: "#f59e0b" }}
                            >
                              Edit
                            </button>

                            <button
                              onClick={async () => {
                                if (
                                  await confirmAlert({
                                    title: "Delete Deal?",
                                    text: "Cannot undo.",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    icon: "warning",
                                  })
                                )
                                  deleteDeal(deal.id);
                              }}
                              className="px-3 py-1 rounded-lg text-white flex-1 min-w-[70px] text-center"
                              style={{ backgroundColor: "#dc2626" }}
                            >
                              Delete
                            </button>

                            <button
                              onClick={() => navigate(`/deal/${deal.id}`)}
                              className="px-3 py-1 rounded-lg text-white flex-1 min-w-[70px] text-center"
                              style={{ backgroundColor: "#2563eb" }}
                            >
                              View
                            </button>
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

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(5px)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-[520px] p-8 overflow-auto shadow-2xl rounded-l-2xl"
            style={{
              backgroundColor: darkMode ? "rgba(30,30,50,0.85)" : "#fff",
              backdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-xl font-semibold mb-6">
              {drawerMode === "add" ? "Add Deal" : "Edit Deal"}
            </h2>
            {drawerMode === "add" ? (
              <AddDealForm
                setIsDrawerOpen={setIsDrawerOpen}
                onSubmit={getAllDeals}
              />
            ) : (
              <EditDealForm
                selectedDealId={selectedDeal?.id}
                setIsEditDealModalOpen={setIsDrawerOpen}
                onSubmit={getAllDeals}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, darkMode }) {
  return (
    <div
      className="p-4 rounded-2xl shadow-sm border"
      style={{
        backgroundColor: darkMode ? "#2c2c3a" : "#fff",
        borderColor: darkMode ? "#444" : "#e5e7eb",
      }}
    >
      <p className="text-sm" style={{ color: darkMode ? "#ccc" : "#6b7280" }}>
        {title}
      </p>
      <h3 className="text-xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
