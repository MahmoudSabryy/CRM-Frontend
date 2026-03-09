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

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const kpiRes = await axios.get(`${baseURL}/dashboard/kpi`, {
        headers: myHeaders,
      });
      setKpis(kpiRes.data);

      const dealsRes = await axios.get(
        `${baseURL}/dashboard/deals-chart?range=${range}`,
        { headers: myHeaders },
      );
      setDealsChart(dealsRes.data);

      const activitiesRes = await axios.get(
        `${baseURL}/dashboard/activities-chart?range=${range}`,
        { headers: myHeaders },
      );
      setActivitiesChart(activitiesRes.data);

      const recentRes = await axios.get(
        `${baseURL}/dashboard/recent-activities`,
        { headers: myHeaders },
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

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 min-h-screen p-2"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 rounded-lg backdrop-blur-md border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {Object.entries(kpis).map(([key, value]) => (
          <GlassCard key={key} title={key} value={value} />
        ))}
      </div>

      {/* Charts */}
      <ChartSection title="Deals Created" data={dealsChart} />
      <ChartSection title="Activities Created" data={activitiesChart} />

      {/* Recent Activities */}
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>

        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex justify-between p-3 rounded-lg mb-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <div>
              <p className="font-medium">{activity.type}</p>
              <p className="text-sm opacity-70">{activity.note}</p>
            </div>
            <span className="text-xs opacity-60">
              {new Date(activity.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================= */
/* Glass KPI Card */

function GlassCard({ title, value }) {
  return (
    <div
      className="glass-card p-6 rounded-xl transition hover:scale-105"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--color-border)",
      }}
    >
      <p className="opacity-70 capitalize">{title}</p>
      <h3
        className="text-2xl font-bold mt-2"
        style={{ color: "var(--color-primary)" }}
      >
        {value}
      </h3>
    </div>
  );
}

/* ========================= */
/* Chart Section */

function ChartSection({ title, data }) {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div
      className="glass-card p-6 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={isDark ? "#334155" : "#e5e7eb"}
            strokeDasharray="3 3"
          />

          <XAxis stroke="var(--color-muted)" dataKey="name" />
          <YAxis stroke="var(--color-muted)" />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "none",
              borderRadius: "10px",
              color: "var(--color-text)",
            }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
