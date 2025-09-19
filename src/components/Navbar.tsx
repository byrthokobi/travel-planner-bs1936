import React, { useState } from 'react';
import { Plane, Home, MapPin, Mail, Menu, User, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { status } = useSession();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <nav className="relative z-50">
            {/* Glassmorphism navbar */}
            <div className="backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg">
                <div className="container-travel">
                    <div className="flex items-center justify-between h-16 px-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Plane className="w-5 h-5 text-white rotate-12" />
                            </div>
                            <Link href="/" onClick={closeMenu}>
                                <div>
                                    <h1 className="text-xl font-bold text-white">TravelPlanner</h1>
                                    {/* <p className="text-white/70 text-xs hidden sm:block">Explore the world</p> */}
                                </div>
                            </Link>
                            <ThemeToggle />
                        </div>


                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {status == "authenticated" && (
                                <>
                                    <Link
                                        href="/"
                                        className="flex items-center px-4 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                        Home
                                    </Link>
                                    <Link
                                        href="/itinerary"
                                        className="flex items-center px-4 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                        Itinerary
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="flex items-center px-4 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                        Contact
                                    </Link>
                                </>
                            )
                            }
                        </div>

                        <div className="hidden md:flex items-center gap-2.5">
                            {status === 'authenticated' ? (
                                <>
                                    <button
                                        onClick={() => handleSignOut()}
                                        className="btn-secondary flex items-center space-x-2 text-sm"
                                    >
                                        <span>Logout</span>
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                    <Link href="/profile">
                                        <button className="btn-primary flex items-center space-x-2 text-sm">
                                            <span>Profile</span>
                                            <User className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <Link href="/login">
                                    <button className="btn-primary flex items-center space-x-2 text-sm">
                                        <span>Login</span>
                                        <User className="w-4 h-4" />
                                    </button>
                                </Link>
                            )}
                        </div>


                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation with slide-in effect */}
            {isMenuOpen && <div className="md:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out translate-x-0">
                <div
                    className="absolute inset-0 bg-black transition-opacity duration-300 bg-opacity-50"
                    onClick={closeMenu}
                />

                {/* Menu content */}
                <div className="relative h-full w-3/4 max-w-xs backdrop-blur-lg bg-white/10 border-r border-white/20 shadow-xl">
                    <div className="flex flex-col h-full pt-20 px-6 space-y-6">
                        {status === "authenticated" && (
                            <>
                                <Link
                                    href="/"
                                    className="flex items-center px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                                    onClick={closeMenu}
                                >
                                    <Home className="w-5 h-5 mr-3" />
                                    Home
                                </Link>
                                <Link
                                    href="/itinerary"
                                    className="flex items-center px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                                    onClick={closeMenu}
                                >
                                    <MapPin className="w-5 h-5 mr-3" />
                                    Itinerary
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                                    onClick={closeMenu}
                                >
                                    <Mail className="w-5 h-5 mr-3" />
                                    Contact
                                </Link>
                            </>
                        )}
                        <div className="pt-4 mt-auto mb-8" style={{ display: "flex", gap: "10px" }}>
                            {status === 'authenticated' ? (
                                <>
                                    <button
                                        onClick={() => handleSignOut()}
                                        className="btn-secondary flex items-center space-x-2 text-sm"
                                    >
                                        <span>Logout</span>
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                    <Link href="/profile" onClick={closeMenu}>
                                        <button className="btn-primary w-full flex items-center justify-center space-x-2 py-3">
                                            <span>Profile</span>
                                            <User className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </>
                            ) :
                                <Link href="/login" onClick={closeMenu}>
                                    <button className="btn-primary w-full flex items-center justify-center space-x-2 py-3">
                                        <span>Login</span>
                                        <User className="w-5 h-5" />
                                    </button>
                                </Link>
                            }
                        </div>
                    </div>
                </div>
            </div>}
        </nav>
    );
}