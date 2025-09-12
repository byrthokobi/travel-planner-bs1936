'use client'

import React, { useEffect, useState } from 'react';
import { Plane, MapPin, Globe, User } from 'lucide-react';
import { toast } from 'react-toastify';

const SignupPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [sex, setSex] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState<{
        avatar?: string
        fullname?: string
        email?: string
        password?: string
    }>({})

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        let newErrors: typeof errors = {};

        if (!file) {
            setAvatar(null);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            newErrors.avatar = 'Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.';
            setErrors(newErrors);
            setAvatar(null);
            return;
        }

        const maxSize = 1024 * 1024;
        if (file.size > maxSize) {
            newErrors.avatar = 'Image size exceeds 1MB. Please choose a smaller file.';
            setErrors(newErrors);
            setAvatar(null);
            return;
        }

        setErrors({});
        setAvatar(file);
    };


    const handleRegistration = async () => {
        setLoading(true);
        setSuccess('');
        let newErrors: typeof errors = {};

        if (!avatar) newErrors.avatar = 'Please upload a profile picture.';
        if (!email) newErrors.email = 'Please provide email.';
        if (!password) newErrors.password = 'Please provide password.';
        if (!fullname) newErrors.fullname = 'Please provide your full name.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }


        // console.log("Ok, this works2");

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('fullname', fullname);
            formData.append('password', password);
            formData.append('sex', sex);
            formData.append('country', country);
            if (avatar) formData.append('avatar', avatar);

            console.log(formData);

            const res = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            });

            console.log(res);

            const data = await res.json();
            if (!res.ok) {
                setErrors({ email: data.error || 'Something went wrong' });
            } else {
                setSuccess('Account created successfully!');
                toast.success('Your Account Has Been Created Successfully')
                window.location.href = '/login'
            }
        } catch (error) {
            console.error(error);
            setErrors({ email: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
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

            <div className="relative w-3/7">
                {/* Glassmorphism Card */}
                <div className="login-form backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 transform transition-all duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                            <Plane className="w-8 h-8 text-white rotate-12" />
                        </div> */}
                        <h1 className="text-xl font-bold text-white mb-2">Join the Adventure</h1>
                        <p className="text-white/80 text-sm">Create your account and start exploring</p>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                        <label htmlFor="avatar-upload" className="relative cursor-pointer">
                            <span className="inline-block w-24 h-24 rounded-full overflow-hidden border-2 border-white/50 transition-all duration-300 group hover:scale-110 shadow-lg">
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/50">
                                        *<User className="w-12 h-12" />
                                    </div>
                                )}
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-full">
                                <span className="text-white text-sm font-semibold">Upload</span>
                            </div>
                        </label>
                        <div className="text-left text-red-800 font-semibold">
                            {errors.avatar}
                        </div>
                        <input
                            id="avatar-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png, image/gif, image/webp"
                            required
                        />
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div className="relative group">
                            <div className="text-left text-red-800 font-semibold">
                                {errors.email}
                            </div>
                            <input
                                type="email"
                                placeholder="*Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-black rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="text-left text-red-800 font-semibold">
                                {errors.fullname}
                            </div>
                            <input
                                type="text"
                                placeholder="*Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-black rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="text-left text-red-800 font-semibold">
                                {errors.password}
                            </div>
                            <input
                                type="password"
                                placeholder="*Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-black rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <select
                                value={sex}
                                onChange={(e) => setSex(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-black rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                            >
                                <option value="" disabled hidden>Select Sex</option>
                                <option value="Male" className="bg-purple-500/80 text-white">Male</option>
                                <option value="Female" className="bg-purple-500/80 text-white">Female</option>
                            </select>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 border border-black rounded-2xl input-text placeholder-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="button"
                            onClick={handleRegistration}
                            disabled={loading}
                            className={`w-full text-white font-semibold py-4 rounded-2xl relative overflow-hidden group
        ${loading
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl cursor-pointer'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? "Registering Your Account...." : "Register"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="font-bolder font-medium hover:underline transition-all duration-300">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70 animate-bounce delay-300"></div>
            </div>
        </div>
    );
};

export default SignupPage;