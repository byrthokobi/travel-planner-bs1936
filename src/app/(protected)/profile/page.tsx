import { auth } from '@/lib/auth'
import React from 'react'
import { prisma } from '@/lib/prisma'
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
    const session = await auth();

    const userEmail = session?.user?.email ?? '';

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { trips: true },
    });

    if (!user) {
        return <div className="text-center">User not found.</div>;
    }

    return <ProfileClient user={user} />;
}
