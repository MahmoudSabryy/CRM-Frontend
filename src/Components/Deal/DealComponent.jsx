import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { baseURL, myHeaders } from "../../Environment/environment";
import EditDealForm from "../Forms/EditDealForm";
import AddDealForm from "../Forms/AddDealForm";
import toast from "react-hot-toast";
import axios from "axios";
import { confirmAlert } from "../../Utils/confirmAlert";
import { useNavigate } from "react-router-dom";

const stages = ["prospecting", "proposal", "negotiation", "won", "lost"];

const stageColors = {
  prospecting: "bg-slate-100 text-slate-600",
  proposal: "bg-blue-100 text-blue-600",
  negotiation: "bg-yellow-100 text-yellow-600",
  won: "bg-green-100 text-green-600",
  lost: "bg-red-100 text-red-600",
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

export default function DealComponent() {
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
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

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

  // Filters + Search + Sort
  const processedDeals = useMemo(() => {
    let filtered = [...deals];

    if (search) {
      filtered = filtered.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filterStage !== "all") {
      filtered = filtered.filter((d) => d.stage === filterStage);
    }

    if (sortByAmount) {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    return filtered;
  }, [deals, search, filterStage, sortByAmount]);

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = processedDeals.filter((d) => d.stage === stage);
    return acc;
  }, {});

  // KPIs
  const totalRevenue = deals.reduce((sum, d) => sum + d.amount, 0);
  const wonRevenue = deals
    .filter((d) => d.stage === "won")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        {/* KPI Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Total Deals" value={deals.length} />
          <KpiCard title="Total Revenue" value={`$${totalRevenue}`} />
          <KpiCard
            title="Won Deals"
            value={deals.filter((d) => d.stage === "won").length}
          />
          <KpiCard title="Won Revenue" value={`$${wonRevenue}`} />
        </div>

        {/* Header Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search deals..."
            className="px-4 py-2 border rounded-xl w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 border rounded-xl"
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
            >
              Sort by Amount
            </button>

            <button
              onClick={() => {
                setDrawerMode("add");
                setSelectedDeal(null);
                setIsDrawerOpen(true);
              }}
              className="bg-indigo-700 text-white px-5 py-2 rounded-xl"
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
                    className="bg-white rounded-2xl shadow-sm p-4 min-h-[400px]"
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
                            className="bg-white border rounded-xl p-4 mb-3 shadow hover:shadow-md"
                          >
                            <h4 className="font-semibold">{deal.title}</h4>

                            <p className="text-sm text-slate-500">
                              {deal?.owner?.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              ${deal.amount}
                            </p>
                            <p className="text-sm text-slate-500">
                              {new Date(
                                deal.expectedCloseDate,
                              ).toLocaleString()}
                            </p>

                            <div className="w-full bg-slate-200 h-2 rounded mt-3">
                              <div
                                className="h-2 bg-indigo-600 rounded"
                                style={{
                                  width: `${stageProgress(deal.stage)}%`,
                                }}
                              />
                            </div>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setDrawerMode("edit");
                                  setSelectedDeal(deal);
                                  setIsDrawerOpen(true);
                                }}
                                className="text-xs px-3 py-1 bg-yellow-500 text-white rounded-lg"
                              >
                                Edit
                              </button>

                              <button
                                onClick={async () => {
                                  const confirmed = await confirmAlert({
                                    title: "Delete Deal?",
                                    text: "This action cannot be undone.",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    icon: "warning",
                                  });
                                  if (confirmed) deleteDeal(deal.id);
                                }}
                                className="text-xs px-3 py-1 bg-red-600 text-white rounded-lg"
                              >
                                Delete
                              </button>

                              <button
                                onClick={() => navigate(`/deal/${deal.id}`)}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg"
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
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          onClick={() => setIsDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[520px] bg-white shadow-2xl p-8 overflow-auto transform transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6">
            {drawerMode === "add" ? "Add Deal" : "Edit Deal"}
          </h2>

          {drawerMode === "add" ? (
            <AddDealForm
              onSubmit={() => {
                setIsDrawerOpen(false);
                getAllDeals();
              }}
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
    </>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
