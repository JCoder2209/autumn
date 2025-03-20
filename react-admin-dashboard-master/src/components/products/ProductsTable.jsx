import { motion } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import LeafletMap from "./LeafletMap";

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [shipments, setShipments] = useState([]);
	const [filteredShipments, setFilteredShipments] = useState([]);
	const [alerts, setAlerts] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedShipment, setSelectedShipment] = useState(null);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);

	// Fetch Shipments
	useEffect(() => {
		axios
			.get("http://localhost:8800/api/shipments")
			.then((res) => {
				setShipments(res.data);
				setFilteredShipments(res.data);
			})
			.catch((err) => console.error("Error fetching shipments:", err));
	}, []);

	// Handle search
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		setFilteredShipments(
			shipments.filter(
				(shipment) =>
					shipment.shipment_id.toLowerCase().includes(term) ||
					shipment.origin.toLowerCase().includes(term) ||
					shipment.destination.toLowerCase().includes(term)
			)
		);
		setCurrentPage(1);
	};

	// Fetch alerts for a specific shipment
	const fetchAlerts = (shipmentId) => {
		axios
			.get(`http://localhost:8800/api/alerts/${shipmentId}`)
			.then((res) => {
				setAlerts(res.data);
				setIsOpen(true);
				setSelectedShipment(shipmentId);
			})
			.catch((err) => console.error("Error fetching alerts:", err));
	};

	const [route, setRoute] = useState(null);
	const [isRouteOpen, setIsRouteOpen] = useState(false);
console.log(route, "route")
	// Fetch optimized route
	const fetchOptimizedRoute = (origin, destination) => {
		axios
			.get(`http://localhost:8800/api/optimized-route/${origin}/${destination}`)
			.then((res) => {
				setRoute(res.data);
				setIsRouteOpen(true);
			})
			.catch((err) => console.error("Error fetching optimized route:", err));
	};
	

	// Pagination Logic
	const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);
	const displayedShipments = filteredShipments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	return (
		<div className="min-h-screen  text-white p-6">
			<motion.div
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				{/* Header Section */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-100">Shipment Details</h2>
					<div className="flex items-center space-x-4">
						{/* Search Input */}
						<div className="relative">
							<input
								type="text"
								placeholder="Search"
								className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								onChange={handleSearch}
								value={searchTerm}
							/>
							<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
						</div>

						{/* Rows Per Page Dropdown */}
						<select
							className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none"
							value={rowsPerPage}
							onChange={(e) => {
								setRowsPerPage(Number(e.target.value));
								setCurrentPage(1);
							}}
						>
							{[5, 10].map((num) => (
								<option key={num} value={num}>
									{num} rows
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Shipments Table */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								{["Shipment ID", "Origin", "Destination", "Status", "Temperature", "Humidity", "Actions", "Optimized Route"].map((header) => (
									<th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										{header}
									</th>
								))}
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-700">
							{displayedShipments.map((shipment) => (
								<motion.tr key={shipment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{shipment.shipment_id}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.origin}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.destination}</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm ${shipment.status === "At Risk" ? "text-red-500" : shipment.status === "Delivered" ? "text-green-500" : "text-gray-300"
											}`}
									>
										{shipment.status}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.temperature}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.humidity}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										<button className="text-indigo-400 hover:text-indigo-300" onClick={() => fetchAlerts(shipment.shipment_id)}>
											View Alerts
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										<button
											className="text-green-400 hover:text-green-300"
											onClick={() => fetchOptimizedRoute(shipment.origin, shipment.destination)}
										>
											View Route
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				<div className="flex justify-between items-center mt-4">
					<p className="text-gray-400 text-sm">
						Page {currentPage} of {totalPages}
					</p>
					<div className="flex space-x-2">
						<button
							className={`px-3 py-1 text-sm rounded-lg ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-white bg-blue-500 hover:bg-blue-600"}`}
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						>
							<ChevronLeft size={18} />
						</button>
						<button
							className={`px-3 py-1 text-sm rounded-lg ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-white bg-blue-500 hover:bg-blue-600"}`}
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>

				{/* Alerts Modal */}
				{isOpen && (
					<motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<motion.div className="bg-gray-900 border border-gray-700 shadow-xl rounded-lg w-[600px] p-6" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
							<div className="flex justify-between items-center border-b border-gray-700 pb-3">
								<h3 className="text-lg font-semibold text-white">Alerts for Shipment {selectedShipment}</h3>
								<X className="text-gray-400 cursor-pointer hover:text-red-500" size={22} onClick={() => setIsOpen(false)} />
							</div>

							<div className="overflow-x-auto mt-4">
								{alerts.length > 0 ? (
									<table className="w-full text-gray-300">
										<thead>
											<tr className="border-b border-gray-700">
												{["Message", "Alert Type", "Created At"].map((header) => (
													<th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">{header}</th>
												))}
											</tr>
										</thead>
										<tbody>
											{alerts.map((alert, index) => (
												<tr key={index} className="border-b border-gray-700">
													<td className="px-4 py-3 text-sm text-gray-100">{alert.message}</td>
													<td className="px-4 py-3 text-sm text-indigo-400">{alert.alert_type}</td>
													<td className="px-4 py-3 text-sm text-gray-400">{new Date(alert.created_at).toLocaleString()}</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<p className="text-gray-400 text-center mt-4">No alerts found.</p>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}

				{isRouteOpen && route && (
					<motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<motion.div className="bg-gray-900 border border-gray-700 shadow-xl rounded-lg w-[600px] p-6" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
							<div className="flex justify-between items-center border-b border-gray-700 pb-3">
								<h3 className="text-lg font-semibold text-white">Optimized Route</h3>
								<X className="text-gray-400 cursor-pointer hover:text-red-500" size={22} onClick={() => setIsRouteOpen(false)} />
							</div>

							<div className="mt-4">
								
								<p className="text-gray-300"><strong>Distance:</strong> {route.distance}</p>
								<p className="text-gray-300"><strong>Duration:</strong> {route.duration}</p>

								<LeafletMap data={route} />

									
							</div>
						</motion.div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default ProductsTable;
