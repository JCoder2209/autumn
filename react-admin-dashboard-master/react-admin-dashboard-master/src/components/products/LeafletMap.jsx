import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icons for source and destination
const sourceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [32, 32],
});

const LeafletMap = ({ data }) => {
  const positions = data.coordinates.map(coord => [coord[0], coord[1]]);
  const source = positions[0];  // First coordinate
  const destination = positions[positions.length - 1]; // Last coordinate

  return (
    <MapContainer center={source} zoom={6} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Source Marker */}
      <Marker position={source} icon={sourceIcon}>
        <Popup>Source</Popup>
      </Marker>

      {/* Destination Marker */}
      <Marker position={destination} icon={destinationIcon}>
        <Popup>Destination</Popup>
      </Marker>

      {/* Route Path */}
      <Polyline positions={positions} color="red" />
    </MapContainer>
  );
};

export default LeafletMap;
