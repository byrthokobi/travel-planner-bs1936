'use client'

import React, { useState } from 'react'
import { demoUser } from '../../../libs/fake-auth';
import { useRouter } from 'next/navigation';

const loginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === demoUser.username && password === demoUser.password) {
            localStorage.setItem('isAuth', 'true');
            router.push('/')
        } else {
            setError('Invalid Credentials');
        }
    }
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-xl font-semibold">Login</h1>
            {error && <div className="text-red-500">{error}</div>}
            <form className="mt-4" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full mb-2 p-2 border border-gray-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-2 p-2 border border-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 mt-2">
                    Login
                </button>
            </form>
        </div>
    )
}

export default loginPage;
