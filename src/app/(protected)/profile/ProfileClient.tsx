"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Globe, Users, MapPin, Edit3, Save, X } from 'lucide-react';

interface User {
    id: number;
    fullname: string;
    email: string;
    sex?: string | null;
    country?: string | null;
    avatar?: string | null;
    trips: { id: number; location: string }[];
}

interface ProfileClientProps {
    user: User;
}

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: user.fullname,
        sex: user.sex || '',
        country: user.country || '',
        avatar: user.avatar || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const updatedUser = await res.json();
            setUser(prev => ({ ...prev, ...updatedUser }));
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-travel section-padding px-4 sm:px-6 lg:px-8 w-full">
            {!isEditing ? (
                <div className="max-w-6xl mx-auto w-full">
                    {/* Header Card */}
                    <div className="travel-card p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 animate-slide-up w-full">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 w-full">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                                {user.avatar ? (
                                    <div className="relative group w-full h-full">
                                        <img
                                            src={user.avatar}
                                            alt="Profile"
                                            className="rounded-2xl object-cover w-full h-full shadow-lg border-4 border-white"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg w-full h-full">
                                        <User className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center lg:text-left w-full break-words">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                    Welcome, {user.fullname}!
                                </h1>
                                <p className="text-gray-600 text-base sm:text-lg mb-4">Ready for your next adventure?</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="country-detail-item break-all">
                                        <div className="country-detail-icon bg-blue-100">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="country-detail-content">
                                            <h4 className="text-sm font-medium">Email</h4>
                                            <p className="text-sm break-all">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="country-detail-item">
                                        <div className="country-detail-icon bg-purple-100">
                                            <Users className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="country-detail-content">
                                            <h4 className="text-sm font-medium">Gender</h4>
                                            <p className="text-sm">{user.sex || 'Not specified'}</p>
                                        </div>
                                    </div>

                                    <div className="country-detail-item sm:col-span-2 xl:col-span-1">
                                        <div className="country-detail-icon bg-green-100">
                                            <Globe className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="country-detail-content">
                                            <h4 className="text-sm font-medium">Country</h4>
                                            <p className="text-sm">{user.country || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="lg:self-start flex-shrink-0 w-full lg:w-auto">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-primary flex items-center justify-center space-x-2 w-full lg:w-auto"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trips */}
                    <div className="travel-card p-4 sm:p-6 animate-fade-in w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                            <div className="flex items-center mb-3 sm:mb-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Your Trips</h2>
                                    <p className="text-gray-600 text-xs sm:text-sm">{user.trips.length} destinations explored</p>
                                </div>
                            </div>
                        </div>

                        {user.trips.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm sm:text-base px-4">No trips yet. Start planning your first adventure!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {user.trips.map(trip => (
                                    <div key={trip.id} className="country-detail-item">
                                        <div className="country-detail-icon bg-emerald-100">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="country-detail-content break-words">
                                            <h4 className="text-sm font-medium">Destination</h4>
                                            <p className="text-sm">{trip.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Editing Mode */
                <div className="max-w-2xl mx-auto px-4 sm:px-0 w-full">
                    <div className="travel-card p-4 sm:p-6 lg:p-8 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                            <div className="flex items-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h1>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="travel-input w-full"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        id="sex"
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="travel-input w-full"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="travel-input w-full"
                                        placeholder="Enter your country"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                                    Avatar URL
                                </label>
                                <input
                                    id="avatar"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    className="travel-input w-full"
                                    placeholder="Enter avatar image URL"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email (Cannot be changed)
                                </label>
                                <input
                                    type="text"
                                    value={user.email}
                                    className="travel-input bg-gray-50 cursor-not-allowed w-full"
                                    disabled
                                />
                            </div>

                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Your Trips (Read Only)</h3>
                                {user.trips.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No trips yet</p>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <div className="flex flex-wrap gap-2">
                                            {user.trips.map(trip => (
                                                <span
                                                    key={trip.id}
                                                    className="inline-flex items-center px-2 sm:px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 break-words max-w-full"
                                                >
                                                    <MapPin className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                                                    <span className="truncate">{trip.location}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 w-full">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-2 sm:order-1"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
