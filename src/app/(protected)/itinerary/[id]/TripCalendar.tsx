"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface TripCalendarProps {
    startDate: Date;
    endDate: Date;
}

export default function TripCalendar({ startDate, endDate }: TripCalendarProps) {
    const isTripDate = (date: Date) => {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        return day >= startDate && day <= endDate;
    };

    return (
        <div className="w-full md:w-1/2 p-4 flex justify-center items-start">
            <Calendar
                value={[startDate, endDate]}
                tileClassName={({ date, view }: { date: Date; view: string }) => {
                    if (view === "month" && isTripDate(date)) {
                        return "bg-blue-200 text-blue-800";
                    }
                    return null;
                }}
            />
        </div>
    );
}