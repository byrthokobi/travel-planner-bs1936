'use client'

import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { Globe, MapPin, Plane } from 'lucide-react';

const LoginPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{
        email?: string
        password?: string
    }>({})
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let newErrors: typeof errors = {};
        if (!email) newErrors.email = 'Please Enter Your Email';
        if (!password) newErrors.password = 'Please Enter Your Password'

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = ('Please enter a valid email address.');
        }

        setErrors(newErrors);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (res?.error) {
            setError(res.error);
        } else if (res?.ok) {
            router.push("/");
        }
        setLoading(false);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 animate-bounce delay-1000">
                    <Plane className="w-8 h-8 text-white rotate-45" />
                </div>
                <div className="absolute top-32 right-16 animate-pulse">
                    <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-20 left-20 animate-bounce delay-500">
                    <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-40 right-10 animate-pulse delay-700">
                    <Plane className="w-6 h-6 text-white -rotate-12" />
                </div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Glassmorphism Card */}
                <div className="login-form backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 transform transition-all duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            <Plane className="w-8 h-8 text-white rotate-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Let's Plan Trips</h2>
                        <p className="text-white/80 text-sm">Login and start exploring</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {errors.email && <p className="text-red-700 font-bold text-sm text-center mt-2">{errors.email}</p>}
                        </div>


                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {errors.password && <p className="text-red-700 font-bold text-sm text-center mt-2">{errors.password}</p>}
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full text-white font-semibold py-4 rounded-2xl relative overflow-hidden group
        ${loading
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none' // disabled style
                                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl cursor-pointer'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? 'Logging In...' : 'Login'}
                                <Plane className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <a href="/registration" className="text-white font-medium hover:underline transition-all duration-300">
                                Register here
                            </a>
                        </p>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70 animate-bounce delay-300"></div>
            </div>
        </div>

    )
}

export default LoginPage;
