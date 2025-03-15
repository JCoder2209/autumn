import { BarChart2, CheckCheck, MailWarning, RouteOff, ShieldAlert, ShoppingBag, TruckIcon, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";


const OverviewPage = () => {

	const [shipments, setShipments] = useState([]);
  	const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8800/api/shipments").then((res) => setShipments(res.data));
    axios.get("http://localhost:8800/api/alerts").then((res) => setAlerts(res.data));
  }, []);
  


	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Shipments' icon={TruckIcon} value={shipments.length} color='#6366F1' />
					<StatCard name='At Risk' icon={ShieldAlert} value={shipments.filter(s => s.status === 'At Risk').length} color='#de0b1d' />
					<StatCard name='Delivered' icon={CheckCheck} value={shipments.filter(s => s.status === 'Delivered').length} color='#10B981' />
					<StatCard name='Delayed' icon={RouteOff} value={shipments.filter(s => s.status === 'Delayed').length} color='#def244' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
