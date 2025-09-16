"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

// Fix default marker icons in Next.js
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface TripMapProps {
    location: string;
}

export default function TripMap({ location }: TripMapProps) {
    const [position, setPosition] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        location
                    )}`
                );
                const data = await res.json();

                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setPosition([lat, lon]);
                } else {
                    console.error("Location not found");
                }
            } catch (error) {
                console.error("Error fetching coordinates:", error);
            }
        };

        if (location) {
            fetchCoordinates();
        }
    }, [location]);

    if (!position) {
        return <div className="text-center">Loading map...</div>;
    }

    return (
        <div className="w-full h-[400px] mt-6 rounded-xl overflow-hidden shadow-md">
            <MapContainer
                center={position}
                zoom={5} // lower zoom for country-level view
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>{location}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
