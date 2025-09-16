import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TripCalendar from "./TripCalendar";
import TripMap from "./TripMap";

export default async function TripPage({ params }: { params: { id: string } }) {
    try {
        const session = await auth();
        const { id } = await params;
        const tripId = Number(id);

        if (isNaN(tripId)) throw new Error("Invalid ID");

        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
        });

        if (!trip || trip.user_id !== Number(session?.user?.id)) {
            return <div className="text-center">Trip not found</div>;
        }

        // Convert trip dates to Date objects for the calendar component
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        return (
            <div className="flex flex-col md:flex-row max-w-4xl mx-auto mt-10 p-6 rounded-2xl shadow-lg border border-gray-200 bg-white">

                {/* Calendar Section */}
                <TripCalendar startDate={startDate} endDate={endDate} />

                {/* Trip Details Section */}
                <div className="w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Trip Details</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Trip ID:</span>
                            <span className="text-gray-800">{trip.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Location:</span>
                            <span className="text-gray-800">{trip.location}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Start Date:</span>
                            <span className="text-gray-800">{new Date(trip.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">End Date:</span>
                            <span className="text-gray-800">{new Date(trip.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Weather Summary:</span>
                            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${trip.weatherSummary ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                                {trip.weatherSummary ? `${trip.weatherSummary}°C` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Created At:</span>
                            <span className="text-gray-800">{new Date(trip.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                        <Link href="/itinerary">
                            <button className="px-4 py-2 btn-primary rounded-lg cursor-pointer">
                                <div className="flex justify-around">
                                    <ArrowLeft />
                                    <p>Back</p>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>

                {/*Map Section */}
                <TripMap location={trip.location} />
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div className="text-center">Error loading trip</div>;
    }
}