import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"];

const AlertChart = ({ alertsByType, topAlertDestinations }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Alerts by Type (Pie Chart) */}
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Alerts by Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={alertsByType} dataKey="count" nameKey="alert_type" cx="50%" cy="50%" outerRadius={100} fill="#8B5CF6">
            {alertsByType.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend wrapperStyle={{ color: "#E5E7EB" }} />
        </PieChart>
      </ResponsiveContainer>

      {/* Top Alert Destinations (Bar Chart) */}
      <h2 className="text-xl font-semibold text-gray-100 mt-6">Top 5 Destinations with Alerts</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topAlertDestinations}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="destination" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend wrapperStyle={{ color: "#E5E7EB" }} />
          <Bar dataKey="alert_count" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AlertChart;
