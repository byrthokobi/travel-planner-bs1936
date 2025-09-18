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
    const [position, setPosition] = useState<LatLngExpression | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // First try: OpenStreetMap Nominatim with proper headers
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
                    {
                        headers: {
                            "User-Agent": "travel-planner-app/1.0 (kadirswachchho@gmail.com)",
                            "Accept-Language": "en",
                        },
                    }
                );

                if (res.status === 403) {
                    throw new Error("Rate limited by Nominatim. Please try again later.");
                }

                const data = await res.json();

                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setPosition([lat, lon]);
                    setIsLoading(false);
                    return;
                } else {
                    // Fallback to another geocoding service if Nominatim fails
                    await tryFallbackGeocoding();
                }
            } catch (error) {
                console.error("Error with Nominatim:", error);
                // Try fallback if Nominatim fails
                await tryFallbackGeocoding();
            }
        };

        const tryFallbackGeocoding = async () => {
            try {
                // Fallback to OpenStreetMap's alternative API
                const fallbackRes = await fetch(
                    `https://openstreetmap.org/geocoding/search?q=${encodeURIComponent(location)}&format=json`
                );

                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json();
                    if (fallbackData && fallbackData.length > 0) {
                        const lat = parseFloat(fallbackData[0].lat);
                        const lon = parseFloat(fallbackData[0].lon);
                        setPosition([lat, lon]);
                        setIsLoading(false);
                        return;
                    }
                }

                throw new Error("Could not geocode location with any service");
            } catch (fallbackError) {
                console.error("Fallback geocoding also failed:", fallbackError);
                setError("Unable to locate this destination on the map. Please try another location.");
                setIsLoading(false);
            }
        };

        if (location) {
            fetchCoordinates();
        } else {
            setIsLoading(false);
        }
    }, [location]);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
                <div className="text-center p-4">
                    <div className="text-red-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Location Error</h3>
                    <p className="text-gray-600">{error}</p>
                    <p className="text-sm text-gray-500 mt-2">Location: {location}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                <p className="text-gray-600">{location}</p>
            </div>
            <MapContainer
                center={position}
                zoom={5}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ height: 'calc(100% - 80px)' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && (
                    <Marker position={position}>
                        <Popup>{location}</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}