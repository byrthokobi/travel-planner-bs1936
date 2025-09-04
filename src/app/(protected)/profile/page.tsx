import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'
import { toast } from 'react-toastify';
import { prisma } from '@/lib/prisma'
import ProfileClient from './ProfileClient';

interface User {
    id: number;
    fullname: string;
    email: string;
    sex?: string;
    country?: string;
    avatar?: string;
}

export default async function ProfilePage() {
    const session = await auth();

    // if (!session || !session.user?.email) {
    //     redirect("/login");
    // }

    const userEmail = session?.user?.email ?? '';

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { trips: true },
    });

    if (!user) {
        return <div>User not found.</div>;
    }

    return <ProfileClient user={user} />;
}
