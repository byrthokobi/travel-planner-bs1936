import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await auth();
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { trips: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Found Error While Grabbing User Details" },
            { status: 500 }
        );
    }
}


export async function PATCH(req: Request) {
    try {
        const session = await auth();
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const updatedUser = await prisma.user.update({
            where: { email: userEmail },
            data: {
                fullname: body.fullname,
                sex: body.sex,
                country: body.country,
                avatar: body.avatar,
            },
        });
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error Updating User Details" },
            { status: 500 }
        );
    }
}