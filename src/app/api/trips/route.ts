import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, location, startDate, endDate, weatherSummary } = body;

    if (!userId || !location || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 14-day limit
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 14) {
      return NextResponse.json(
        { error: "Trips cannot exceed 14 days." },
        { status: 400 }
      );
    }

    // check overlapping trips
    const overlap = await prisma.trip.findFirst({
      where: {
        user_id: Number(userId),
        AND: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlap) {
      return NextResponse.json(
        { error: "Your selected dates overlap with another trip." },
        { status: 400 }
      );
    }
    
    const trip = await prisma.trip.create({
      data: {
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weatherSummary: String(weatherSummary),
        user_id: Number(userId),
      },
    });

    return NextResponse.json(trip, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const session = await auth();

    if(!session)return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const userID = Number(session.user?.id);
    
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset")) || 0;
    const limit = Number(searchParams.get("limit")) || 7;

    const trips = await prisma.trip.findMany({
      where: { user_id: userID },
      orderBy: { startDate: "asc" },
      skip: offset,
      take: limit,
    });

    const totalCount = await prisma.trip.count({
      where: { user_id: userID },
    });

    return NextResponse.json({
      trips,
      hasMore: offset + trips.length < totalCount,
    });
  } catch (error) {
    console.error("Trip Fetching Error: ", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log("DELETE API called with id:", id, "typeof:", typeof id);
    const tripId = Number(id);
    await prisma.trip.delete({ where: { id: tripId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error: ", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
