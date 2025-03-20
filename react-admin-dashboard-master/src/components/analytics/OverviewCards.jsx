import { motion } from "framer-motion";
import { Package, AlertTriangle, Thermometer, Truck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const OverviewCards = ({ shipmentStatus, atRiskShipments, alertsByType }) => {
  // Calculate total shipments
  const totalShipments = shipmentStatus?.reduce((sum, item) => sum + item.count, 0) || 0;
  
  // Get alerts count
  const totalAlerts = alertsByType?.reduce((sum, item) => sum + item.count, 0) || 0;

  // Define overview data dynamically
  const overviewData = [
    { name: "Total Shipments", value: totalShipments, icon: Truck, change: 5.2 },
    { name: "Shipments At Risk", value: atRiskShipments?.reduce((sum, item) => sum + item.at_risk, 0) || 0, icon: AlertTriangle, change: -2.1 },
    { name: "Alerts", value: totalAlerts, icon: Thermometer, change: 3.8 },
    { name: "Delivered", value: shipmentStatus?.find(item => item.status === "Delivered")?.count || 0, icon: Package, change: 4.5 },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-gray-100">{item.value}</p>
            </div>

            <div
              className={`p-3 rounded-full bg-opacity-20 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <item.icon className={`size-6 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
            </div>
          </div>

          <div className={`mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
            <span className="ml-1 text-sm font-medium">{Math.abs(item.change)}%</span>
            <span className="ml-2 text-sm text-gray-400">vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
