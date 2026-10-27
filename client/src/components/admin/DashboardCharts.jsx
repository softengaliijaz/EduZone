import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = { fill: "var(--text-subtle)", fontSize: 11 };
const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--text)",
  boxShadow: "var(--shadow-md)",
};

const ChartPanel = ({ title, description, children, empty }) => (
  <section className="admin-chart-panel">
    <header className="admin-chart-panel__header">
      <div><h2>{title}</h2><p>{description}</p></div>
      <span className="admin-chart-panel__period">Last 6 months</span>
    </header>
    {empty ? <div className="admin-chart-panel__empty">Activity data will appear here as the platform is used.</div> : <div className="admin-chart-panel__plot">{children}</div>}
  </section>
);

export const DashboardCharts = ({ userTrend = [], enrollmentTrend = [] }) => {
  const userData = userTrend || [];
  const enrollmentData = enrollmentTrend || [];
  const isEmpty = userData.every((item) => !item.value) && enrollmentData.every((item) => !item.value);

  return (
    <div className="admin-charts">
      <ChartPanel title="User growth" description="New accounts created each month" empty={isEmpty}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={userData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
            <defs><linearGradient id="adminUsersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity={0.22} /><stop offset="95%" stopColor="var(--brand)" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" name="New users" stroke="var(--brand)" strokeWidth={2.5} fill="url(#adminUsersFill)" activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartPanel>

      <ChartPanel title="Course enrollments" description="New course enrollments each month" empty={isEmpty}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={enrollmentData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" name="Enrollments" stroke="#8b6cc7" strokeWidth={2.5} dot={{ r: 3, fill: "#8b6cc7" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
};
