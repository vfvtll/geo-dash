"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useData } from "../DataContext/DataContext";

const MapComponent: React.FC = ({}) => {
	const { table } = useData();
	const defaultPosition: [number, number] = [52.4402961, 20.6717224]; // Центральная точка
	const rows = table.getFilteredRowModel().rows;
	return (
		<MapContainer
			center={defaultPosition}
			zoom={6}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{rows.map(({ original: location }) => (
				<Marker
					key={location.id}
					position={[location.latitude, location.longitude]}
				>
					<Popup>
						{location.first_name} {location.last_name} <br />
						GPS: {location.gps_code}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default MapComponent;
