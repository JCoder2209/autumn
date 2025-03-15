import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const ShipmentChart = ({ shipments, avgTempHumidity }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Shipments Per Destination */}
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Shipments Per Destination</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={shipments}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="destination" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend wrapperStyle={{ color: "#E5E7EB" }} />
          <Bar dataKey="total_shipments" fill="#3B82F6" name="Total Shipments" />
        </BarChart>
      </ResponsiveContainer>

      {/* Average Temperature & Humidity */}
      <h2 className="text-xl font-semibold text-gray-100 mt-6">Avg Temperature & Humidity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={avgTempHumidity}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="destination" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend wrapperStyle={{ color: "#E5E7EB" }} />
          <Bar dataKey="avg_temp" fill="#F59E0B" name="Avg Temp (°C)" />
          <Bar dataKey="avg_humidity" fill="#10B981" name="Avg Humidity (%)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ShipmentChart;
