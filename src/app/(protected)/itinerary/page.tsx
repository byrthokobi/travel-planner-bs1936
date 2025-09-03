"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, MapPin, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Trip {
    id: number;
    user_id: number;
    location: string;
    startDate: string;
    endDate: string;
    weatherSummary?: string;
    createdAt: string;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tripLocation: string;
}

function DeleteModal({ isOpen, onClose, onConfirm, tripLocation }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Delete Trip</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">Are you sure you want to delete this trip?</p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-semibold">{tripLocation}</span> will be permanently removed.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>

                {/* Footer */}
                <div className="flex space-x-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors duration-200"
                    >
                        Delete Trip
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ItineraryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Trip; direction: "asc" | "desc" }>({
        key: "startDate",
        direction: "asc",
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tripId: number | null; tripLocation: string }>({
        isOpen: false,
        tripId: null,
        tripLocation: "",
    });

    // useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         router.push("/login");
    //     }
    // }, [status, router]);

    useEffect(() => {
        async function fetchTrips() {
            if (status !== "authenticated" || !session?.user?.id) return;
            try {
                const res = await fetch(`/api/trips`);
                if (!res.ok) throw new Error("Failed to Load Trips");
                const data: Trip[] = await res.json();
                setTrips(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTrips();
    }, [session, status]);

    const sortedTrips = [...trips].sort((a, b) => {
        const { key, direction } = sortConfig;
        let comparison = 0;

        if (key === "startDate") {
            comparison = new Date(a[key]).getTime() - new Date(b[key]).getTime();
        } else if (key === "location") {
            comparison = a[key]?.localeCompare(b[key] || "") || 0;
        }

        return direction === "asc" ? comparison : -comparison;
    });

    const toggleSort = (key: keyof Trip) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const openDeleteModal = (tripId: number, tripLocation: string) => {
        setDeleteModal({ isOpen: true, tripId, tripLocation });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, tripId: null, tripLocation: "" });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.tripId) return;

        try {
            const res = await fetch("/api/trips", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteModal.tripId }),
            });
            if (!res.ok) throw new Error("Failed to delete trip");
            setTrips((prev) => prev.filter((t) => t.id !== deleteModal.tripId));
            toast.success("The Trip is Successfully Deleted");
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while deleting the trip.");
        }
    };

    return (
        <div className="container-travel section-padding">
            {/* Header */}
            <div className="travel-card p-4 md:p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-l md:text-xl font-bold text-gray-800 mb-1">Your Saved Trips</h2>
                            <p className="text-sm md:text-base text-gray-600">Manage your travel adventures</p>
                        </div>
                    </div>
                    <Link href="/">
                        <button className="btn-primary flex items-center space-x-2 w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            <span>Add Trip</span>
                        </button>
                    </Link>
                </div>
            </div>

            {trips.length === 0 ? (
                <div className="travel-card p-8 md:p-12 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No trips saved yet.</h3>
                    <p className="text-sm md:text-base text-gray-500 mb-6">Start planning your next adventure!</p>
                    <Link href="/">
                        <button className="btn-primary flex items-center space-x-2 mx-auto">
                            <Plus className="w-4 h-4" />
                            <span>Plan Your First Trip</span>
                        </button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="travel-card overflow-hidden hidden md:block">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 items-center font-semibold text-gray-700">
                                <div className="col-span-3 flex items-center">
                                    <span>Destination</span>
                                    <button
                                        onClick={() => toggleSort("location")}
                                        className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        {sortConfig.key === "location" && sortConfig.direction === "asc" ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <span>Start Date</span>
                                    <button
                                        onClick={() => toggleSort("startDate")}
                                        className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        {sortConfig.key === "startDate" && sortConfig.direction === "asc" ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="col-span-2">End Date</div>
                                <div className="col-span-3">Weather Summary</div>
                                <div className="col-span-2 text-center">Actions</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {sortedTrips.map((trip) => (
                                <div key={trip.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                                    <MapPin className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-gray-800">{trip.location}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-700">{new Date(trip.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-700">{new Date(trip.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="col-span-3">
                                            {trip.weatherSummary ? (
                                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {trip.weatherSummary}°C
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex justify-center space-x-2">
                                            <button className="btn-secondary text-sm px-3 py-1">
                                                View
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(trip.id, trip.location)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                        {/* Mobile Sort Controls */}
                        <div className="travel-card p-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-medium text-gray-600 mr-2">Sort by:</span>
                                <button
                                    onClick={() => toggleSort("location")}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${sortConfig.key === "location"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <span>Location</span>
                                    {sortConfig.key === "location" && (
                                        sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    )}
                                </button>
                                <button
                                    onClick={() => toggleSort("startDate")}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${sortConfig.key === "startDate"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <span>Date</span>
                                    {sortConfig.key === "startDate" && (
                                        sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Trip Cards */}
                        {sortedTrips.map((trip) => (
                            <div key={trip.id} className="travel-card p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center flex-1">
                                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg truncate">{trip.location}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openDeleteModal(trip.id, trip.location)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {trip.weatherSummary && (
                                    <div className="mb-3">
                                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {trip.weatherSummary}°C
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button className="btn-secondary text-sm px-4 py-2">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                tripLocation={deleteModal.tripLocation}
            />
        </div>
    );
}