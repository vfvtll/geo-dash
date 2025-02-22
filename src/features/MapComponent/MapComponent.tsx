"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DataType, useData } from "../DataContext/DataContext";

const MapComponent: React.FC = () => {
	const { table } = useData();
	const [copied, setCopied] = useState<number>(-1);
	const defaultPosition: [number, number] = [52.4402961, 20.6717224]; // Центральная точка
	const rows = table.getFilteredRowModel().rows;

	const handleCopy = (
		location: DataType,
		setCopied: (value: number) => void
	) => {
		const textToCopy = `
            ${location.first_name} ${location.last_name}
            📍 GPS: ${location.gps_code}
            📞 Telefon: ${location.phone_number}
            🎂 Doğum ili: ${location.birth_year}
            ⏳ Tarix və saat: ${location.datetime}
            🌍 Koordinatlar: ${location.latitude}, ${location.longitude}
        `.trim();

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				setCopied(location.id);
				setTimeout(() => setCopied(-1), 2000);
			})
			.catch((err) => console.error("Kopyalama xətası:", err));
	};

	if (typeof window === "undefined") return;
	return (
		<MapContainer
			center={defaultPosition}
			zoom={6}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{rows.map(({ original: location }) => {
				return (
					<Marker
						key={location.id}
						position={[location.latitude, location.longitude]}
					>
						<Popup>
							<div className="text-sm text-gray-800">
								<strong>
									{location.first_name} {location.last_name}
								</strong>{" "}
								<br />
								📍 <strong>GPS:</strong> {location.gps_code} <br />
								📞 <strong>Telefon:</strong> {location.phone_number} <br />
								🎂 <strong>Doğum ili:</strong> {location.birth_year} <br />⏳{" "}
								<strong>Tarix və saat:</strong> {location.datetime} <br />
								🌍 <strong>Koordinatlar:</strong> {location.latitude},{" "}
								{location.longitude}
							</div>

							{/* Кнопка копирования */}
							<button
								onClick={() => handleCopy(location, setCopied)}
								className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                                   hover:bg-blue-600 transition text-sm w-full"
							>
								{copied === location.id ? "✅ Kopyalandı!" : "📋 Kopyala"}
							</button>
						</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
};

export default MapComponent;
