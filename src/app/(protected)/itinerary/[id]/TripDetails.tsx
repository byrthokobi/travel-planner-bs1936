"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TripDetails({ trip }: { trip: any }) {
    return (
        <div>
            <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Trip Details
            </div>

            <div className="space-y-3">
                <Detail label="Trip ID" value={trip.id} />
                <Detail label="Location" value={trip.location} />
                <Detail label="Start Date" value={formatDate(trip.startDate)} />
                <Detail label="End Date" value={formatDate(trip.endDate)} />
                <Detail
                    label="Weather Summary"
                    value={trip.weatherSummary ? `${trip.weatherSummary}°C` : "N/A"}
                    badge={!!trip.weatherSummary}
                />
                <Detail label="Created At" value={formatDateTime(trip.createdAt)} />
            </div>

            <div className="mt-6 flex justify-center">
                <Link href="/itinerary">
                    <button className="px-4 py-2 btn-primary rounded-lg flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                </Link>
            </div>
        </div>
    );
}

function Detail({
    label,
    value,
    badge,
}: {
    label: string;
    value: string | number;
    badge?: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span className="font-medium text-gray-600">{label}:</span>
            {badge ? (
                <span className="px-2 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {value}
                </span>
            ) : (
                <span className="text-gray-800">{value}</span>
            )}
        </div>
    );
}

function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
}

function formatDateTime(date: string | Date) {
    return new Date(date).toLocaleString();
}
