"use client";

import { useState } from "react";
import { Calendar, MapPin, X } from "lucide-react";
import TripCalendar from "./TripCalendar";
import { TripProps } from "./page";

interface TripCoverProps {
    trip: TripProps;
    startDate: Date;
    endDate: Date;
}

export default function TripCover({ trip, startDate, endDate }: TripCoverProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    const formatDateRange = (start: Date, end: Date) => {
        const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
        const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
        const startDay = start.getDate();
        const endDay = end.getDate();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} → ${endDay}`;
        }
        return `${startMonth} ${startDay} → ${endMonth} ${endDay}`;
    };

    return (
        <>
            {/* Hero Section with Cover Photo */}
            <div className="relative h-96 overflow-hidden"
                style={{
                    maxWidth: "1200px",
                    margin: "auto",
                    borderRadius: "12px",
                    marginTop: "10px"
                }}>
                {/* Background Image Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                    }}
                />

                {/* Content Overlay */}
                <div className="relative z-10 h-full p-8 text-white flex items-end">
                    {/* Top Navigation
                    <div className="flex justify-between items-start">
                        <div className="flex space-x-4">
                            <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                                <Users size={18} />
                                <span>Invite</span>
                            </button>
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div> */}

                    {/* Main Content */}
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <h1 className="text-5xl font-bold mb-4">
                            Trip to {trip.location}
                        </h1>

                        <div className="flex items-center space-x-6 text-lg">
                            <button
                                onClick={() => setShowCalendar(true)}
                                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                            >
                                <Calendar size={20} />
                                <span>{formatDateRange(startDate, endDate)}</span>
                            </button>

                            <div className="flex items-center space-x-2">
                                <MapPin size={20} />
                                <span>{trip.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Calendar Modal */}
            {
                showCalendar && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-semibold mb-4">Trip Calendar</h3>
                            <TripCalendar startDate={startDate} endDate={endDate} />

                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-gray-600">
                                    <p><strong>Start:</strong> {startDate.toLocaleDateString()}</p>
                                    <p><strong>End:</strong> {endDate.toLocaleDateString()}</p>
                                    <p><strong>Duration:</strong> {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}