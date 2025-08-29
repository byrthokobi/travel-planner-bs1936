import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from 'bcrypt';

const registerSchema = z.object({
  email: z.string().email('Must be a valid email'),
  fullname: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export async function POST(req:Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            const issues = parsed.error.issues ?? [];
            const message = issues.length > 0 ? issues[0].message : 'Invalid input';
            return NextResponse.json({ error: message }, { status: 400 });
        }

        const { email, fullname, password } = parsed.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                fullname,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}