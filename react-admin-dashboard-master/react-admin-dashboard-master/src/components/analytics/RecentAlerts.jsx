import React from "react";
import { motion } from "framer-motion";

const RecentAlerts = ({ recentAlerts }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Recent Alerts (Last 24 Hours)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="px-4 py-2 text-left">Shipment ID</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {recentAlerts.map((alert, index) => (
              <tr key={index} className="border-t border-gray-600 text-gray-200">
                <td className="px-4 py-2">{alert.shipment_id}</td>
                <td className="px-4 py-2">{alert.message}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${alert.alert_type === "Critical" ? "bg-red-500 text-white" :
                      alert.alert_type === "Warning" ? "bg-yellow-500 text-gray-900" :
                      "bg-blue-500 text-white"}`}>
                    {alert.alert_type}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(alert.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentAlerts;
