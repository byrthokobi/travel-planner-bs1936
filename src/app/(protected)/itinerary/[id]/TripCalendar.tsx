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
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        return day >= start && day <= end;
    };

    const isStartDate = (date: Date) => {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        return day.getTime() === start.getTime();
    };

    const isEndDate = (date: Date) => {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        return day.getTime() === end.getTime();
    };

    return (
        <div className="trip-calendar">
            <style jsx global>{`
                .trip-calendar .react-calendar {
                    width: 100%;
                    border: none;
                    font-family: inherit;
                }
                
                .trip-calendar .react-calendar__navigation {
                    display: flex;
                    height: 44px;
                    margin-bottom: 1rem;
                }
                
                .trip-calendar .react-calendar__navigation button {
                    min-width: 44px;
                    background: none;
                    font-size: 16px;
                    margin-top: 0;
                }
                
                .trip-calendar .react-calendar__navigation button:enabled:hover,
                .trip-calendar .react-calendar__navigation button:enabled:focus {
                    background-color: #f3f4f6;
                }
                
                .trip-calendar .react-calendar__month-view__weekdays {
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.75rem;
                    color: #6b7280;
                }
                
                .trip-calendar .react-calendar__month-view__days__day {
                    position: relative;
                }
                
                .trip-calendar .react-calendar__tile {
                    max-width: 100%;
                    padding: 10px 6px;
                    background: none;
                    text-align: center;
                    line-height: 16px;
                    font-size: 14px;
                }
                
                .trip-calendar .react-calendar__tile:enabled:hover,
                .trip-calendar .react-calendar__tile:enabled:focus {
                    background-color: #f3f4f6;
                }
                
                .trip-calendar .trip-start {
                    background: #3b82f6 !important;
                    color: white !important;
                    border-radius: 8px 0 0 8px;
                    position: relative;
                }
                
                .trip-calendar .trip-end {
                    background: #3b82f6 !important;
                    color: white !important;
                    border-radius: 0 8px 8px 0;
                    position: relative;
                }
                
                .trip-calendar .trip-middle {
                    background: #dbeafe !important;
                    color: #1e40af !important;
                    position: relative;
                }
                
                .trip-calendar .trip-single {
                    background: #3b82f6 !important;
                    color: white !important;
                    border-radius: 8px;
                }
            `}</style>

            <Calendar
                value={[startDate, endDate]}
                selectRange={true}
                tileClassName={({ date, view }: { date: Date; view: string }) => {
                    if (view === "month" && isTripDate(date)) {
                        if (isStartDate(date) && isEndDate(date)) {
                            return "trip-single";
                        } else if (isStartDate(date)) {
                            return "trip-start";
                        } else if (isEndDate(date)) {
                            return "trip-end";
                        } else {
                            return "trip-middle";
                        }
                    }
                    return null;
                }}
            />
        </div>
    );
}