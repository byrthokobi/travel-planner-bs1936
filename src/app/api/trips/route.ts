// app/api/trips/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, location, startDate, endDate, weatherSummary } = body;

    if (!userId || !location || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use `connect` to link the trip to the user
    const trip = await prisma.trip.create({
      data: {
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weatherSummary: String(weatherSummary),
        user_id: Number(userId),
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
