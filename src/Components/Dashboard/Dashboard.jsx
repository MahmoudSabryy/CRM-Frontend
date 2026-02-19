import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { baseURL, myHeaders } from "../../Environment/environment";

/* ========================= */

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  const [kpis, setKpis] = useState({
    deals: 0,
    leads: 0,
    contacts: 0,
    activities: 0,
  });

  const [dealsChart, setDealsChart] = useState([]);
  const [activitiesChart, setActivitiesChart] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch data from backend
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const kpiRes = await axios.get(`${baseURL}/dashboard/kpi`, {
        headers: myHeaders,
      });
      setKpis(kpiRes.data);

      const dealsRes = await axios.get(
        `${baseURL}/dashboard/deals-chart?range=${range}`,
        {
          headers: myHeaders,
        },
      );
      setDealsChart(dealsRes.data);

      const activitiesRes = await axios.get(
        `${baseURL}/dashboard/activities-chart?range=${range}`,
        {
          headers: myHeaders,
        },
      );
      setActivitiesChart(activitiesRes.data);

      const recentRes = await axios.get(
        `${baseURL}/dashboard/recent-activities`,
        {
          headers: myHeaders,
        },
      );
      setRecentActivities(recentRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [range]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Deals" value={kpis.deals} growth={5.5} />
            <StatCard title="Leads" value={kpis.leads} growth={8.2} />
            <StatCard title="Contacts" value={kpis.contacts} growth={3.1} />
            <StatCard
              title="Activities"
              value={kpis.activities}
              growth={12.4}
            />
          </>
        )}
      </div>

      {/* Deals Chart */}
      <ChartSection
        title="Deals Created Over Time"
        data={dealsChart}
        dataKey="count"
        loading={loading}
        lineColor="#2563eb"
      />

      {/* Activities Chart */}
      <ChartSection
        title="Activities Created Over Time"
        data={activitiesChart}
        dataKey="count"
        loading={loading}
        lineColor="#f97316"
      />

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Recent Activities
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        ) : recentActivities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No recent activities
          </p>
        ) : (
          <ul className="space-y-2">
            {recentActivities.map((activity) => (
              <li
                key={activity.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-gray-400">{activity.note}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-gray-500">{activity.userName}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ========================= */
/* Chart Section Component */
function ChartSection({ title, data, dataKey, loading, lineColor }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>
      {loading ? (
        <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ========================= */
/* KPI CARD */
function StatCard({ title, value, growth }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);
    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(counter);
  }, [value]);

  const isPositive = growth >= 0;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2 dark:text-white">{count}</h3>
      <p
        className={`mt-2 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(growth)}%
      </p>
    </div>
  );
}

/* ========================= */
/* Skeleton Loader */
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  );
}
