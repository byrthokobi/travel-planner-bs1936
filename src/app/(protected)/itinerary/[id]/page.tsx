import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TripMap from "./TripMap";
import TripDetails from "./TripDetails";
import TripCover from "./TripCover";

export interface TripProps {
    id: number;
    user_id: number;
    location: string;
    startDate: string;
    endDate: string;
    weatherSummary?: string;
    createdAt: string;
};

export default async function TripPage({ params }: { params: { id: string } }) {
    const session = await auth();
    const { id } = await params;
    const tripId = Number(id);

    if (isNaN(tripId)) return <NotFound message="Invalid trip ID" />;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } }) as TripProps | null;

    if (!trip || trip.user_id !== Number(session?.user?.id)) {
        return <NotFound message="Trip not found" />;
    }

    return (
        <div className="min-h-screen">
            {/* Cover Photo Section */}
            <TripCover
                trip={trip}
                startDate={new Date(trip.startDate)}
                endDate={new Date(trip.endDate)}
            />

            {/* Main Content Layout */}
            <div className="flex" style={{ margin: "auto", justifyContent: "space-between", maxWidth: "1200px" }}>
                {/* Left Side - Scrollable Content */}
                <div className="flex-1 p-6 max-w-2xl">
                    <div className="space-y-6 bg-white p-6 rounded-xl">
                        <TripDetails trip={trip} />

                        {/* Additional sections can be added here */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Itinerary</h3>
                            <p className="text-gray-600">Your trip itinerary will appear here...</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Accommodations</h3>
                            <p className="text-gray-600">Your accommodation details will appear here...</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Activities</h3>
                            <p className="text-gray-600">Planned activities and experiences...</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Fixed Map */}
                <div className="w-[400px] sticky top-0 h-screen">
                    <div className="h-full p-6">
                        <TripMap location={trip.location} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotFound({ message }: { message: string }) {
    return <div className="text-center text-red-600 font-medium">{message}</div>;
}