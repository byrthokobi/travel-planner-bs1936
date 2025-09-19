'use client'
import { Box, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface LayoutPublicProps {
    children: React.ReactNode;
}

const LayoutPublic: React.FC<LayoutPublicProps> = ({ children }) => {
    const { status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <main>{children}</main>
    )
}

export default LayoutPublic;