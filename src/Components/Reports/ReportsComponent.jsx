import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { baseURL, myHeaders } from "../../Environment/environment";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AuthContext } from "../../Context/Auth Context/AuthContext";

export default function ReportsDashboard() {
  const { userData } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [usersList, setUsersList] = useState([]);

  /* ================== FETCH DASHBOARD REPORTS ================== */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/report/dashboard`, {
        headers: myHeaders,
        params: {
          from,
          to,
          userId: userData.role === "admin" ? selectedUser : undefined,
        },
      });
      setReports(res.data);
    } catch (err) {
      console.error(err.response);
    }
    setLoading(false);
  }, [from, to, selectedUser, userData.role]);

  /* ================== FETCH USERS IF ADMIN ================== */
  const fetchUsers = useCallback(async () => {
    if (userData.role !== "admin") return;
    try {
      const res = await axios.get(`${baseURL}/user?active=true`, {
        headers: myHeaders,
      });
      setUsersList(res.data);
    } catch (err) {
      console.error(err.response);
    }
  }, [userData.role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading) return <p>Loading reports...</p>;
  if (!reports) return <p>No data available.</p>;

  const {
    activitySummary,
    salesSummary,
    pipelineSummary,
    leadsSummary,
    performanceSummary,
    businessHealthSummary,
  } = reports;

  return (
    <div className="space-y-8">
      {/* ================== FILTERS ================== */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        {userData.role === "admin" && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            <option value="all">All Users</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ================== KPI CARDS ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard title="Total Deals" value={salesSummary.totalDeals} />
        <KpiCard title="Total Revenue" value={salesSummary.totalRevenue} />
        <KpiCard title="Open Pipeline" value={salesSummary.openPipeline} />
        <KpiCard
          title="Total Activities"
          value={activitySummary.totalActivities}
        />
      </div>

      {/* ================== PIPELINE CHART ================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Pipeline by Stage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineSummary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================== LEADS SUMMARY ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard title="Total Leads" value={leadsSummary.totalLeads} />
        <KpiCard title="Converted Leads" value={leadsSummary.convertedLeads} />
      </div>

      {/* ================== ACTIVITIES SUMMARY ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Calls" value={activitySummary.totalCalls} />
        <KpiCard title="Total Emails" value={activitySummary.totalEmails} />
        <KpiCard title="Total Meetings" value={activitySummary.totalMeetings} />
      </div>

      {/* ================== PERFORMANCE CHART ================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceSummary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================== BUSINESS HEALTH ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Weighted Forecast"
          value={businessHealthSummary.weightedForecast}
        />
        <KpiCard
          title="Active Deals"
          value={businessHealthSummary.activeDeals}
        />
        <KpiCard
          title="Closed Deals"
          value={businessHealthSummary.closedDeals}
        />
      </div>
    </div>
  );
}

/* ================== KPI CARD ================== */
function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}
