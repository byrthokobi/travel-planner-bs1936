import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

const registerSchema = z.object({
  email: z.string().email('Must be a valid email'),
  fullname: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const fullname = formData.get("fullname") as string;
    const password = formData.get("password") as string;
    const sex = formData.get("sex") as string;
    const country = formData.get("country") as string;
    const avatar = formData.get("avatar") as File | null;

    // Validate fields
    const validationResult = registerSchema.safeParse({ email, fullname, password });
    if (!validationResult.success) {
      const issues = validationResult.error.issues ?? [];
      const message = issues.length > 0 ? issues[0].message : 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!avatar) {
      return NextResponse.json({ error: 'Avatar image is required.' }, { status: 400 });
    }

    if (!avatar.type.startsWith("image/")) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Upload avatar to Cloudinary
    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinaryUpload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      stream.end(buffer);
    });

    const result: any = await cloudinaryUpload();
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
        avatar: result.secure_url,
        sex,
        country,
      },
    });

    return NextResponse.json({ success: true, message: 'User registered successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}
