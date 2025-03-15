import Header from "../components/common/Header";
import { useEffect, useState } from "react";

import OverviewCards from "../components/analytics/OverviewCards";
import AlertChart from "../components/analytics/AlertChart";
import RecentAlerts from "../components/analytics/RecentAlerts";

import ShipmentChart from "../components/analytics/ShipmentChart";


const AnalyticsPage = () => {

	  const [shipments, setShipments] = useState([]);
  const [shipmentStatus, setShipmentStatus] = useState([]);
  const [avgTempHumidity, setAvgTempHumidity] = useState([]);
  const [alertsByType, setAlertsByType] = useState([]);
  const [topAlertDestinations, setTopAlertDestinations] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [atRiskShipments, setAtRiskShipments] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shipments/destination").then(res => res.json()).then(setShipments);
    fetch("http://127.0.0.1:8000/api/shipments/status").then(res => res.json()).then(setShipmentStatus);
    fetch("http://127.0.0.1:8000/api/shipments/temp-humidity").then(res => res.json()).then(setAvgTempHumidity);
    fetch("http://127.0.0.1:8000/api/alerts/type").then(res => res.json()).then(setAlertsByType);
    fetch("http://127.0.0.1:8000/api/alerts/top-destinations").then(res => res.json()).then(setTopAlertDestinations);
    fetch("http://127.0.0.1:8000/api/alerts/recent").then(res => res.json()).then(setRecentAlerts);
    fetch("http://127.0.0.1:8000/api/shipments/at-risk").then(res => res.json()).then(setAtRiskShipments);
  }, []);

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards
					shipmentStatus={shipmentStatus}
					atRiskShipments={atRiskShipments}
					alertsByType={alertsByType}
				/>
				<ShipmentChart shipments={shipments} avgTempHumidity={avgTempHumidity} />
				<AlertChart alertsByType={alertsByType} topAlertDestinations={topAlertDestinations} />
				<RecentAlerts recentAlerts={recentAlerts} />



			</main>
		</div>
	);
};
export default AnalyticsPage;

