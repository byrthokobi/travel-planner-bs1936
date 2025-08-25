'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuth') === 'true';
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [router]);

    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuth') === 'true';
    return isAuthenticated ? <div>{children}</div> : null;
}
