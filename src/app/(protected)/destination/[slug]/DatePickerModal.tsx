"use client"

import { Box, Button, Modal, Typography } from "@mui/material";
import { DatePicker, DateRange, DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Dayjs } from "dayjs";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

interface DatePickerModalProps {
    countryName: string;
    currentTemperature: number;
    userId: string | number;
}

export default function DatePickerModal({ countryName, currentTemperature, userId }: DatePickerModalProps) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // const fetchWeather = async () => {
    //     try {
    //         const res = await fetch(
    //             `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
    //         );
    //         const data = await res.json();
    //         return data?.current_weather?.temperature ?? "N/A";
    //     } catch (err) {
    //         console.error("Failed to fetch weather:", err);
    //         return "N/A";
    //     }
    // };
    const handleSave = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both Start and End Dates");
            return;
        }

        if (endDate.isBefore(startDate)) {
            toast.error("End Date cannot be before Start Date");
            return;
        }

        setSaving(true);

        try {
            const weatherSummary = currentTemperature.toString();

            const response = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    location: countryName,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    weatherSummary
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to save trip: ${response.statusText}`);
            }

            toast.success("Trip Added Successfully!");
            setOpen(false);
            setStartDate(null);
            setEndDate(null);

            // Use router.push instead of redirect for client-side navigation
            router.push("/");
        } catch (error) {
            console.error("Error saving trip:", error);
            toast.error("Failed to save trip. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <button className="btn-secondary mt-3 w-full" onClick={() => setOpen(true)}>
                Add Destination
            </button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10%", // Appear from bottom
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        width: 300,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Select Trip Dates
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newDate) => setStartDate(newDate)}
                            disablePast
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newDate) => setEndDate(newDate)}
                            disablePast
                            minDate={startDate || undefined} // cannot pick before startDate
                            sx={{ mt: 2 }}
                        />
                    </LocalizationProvider>

                    {/* Display current temperature for confirmation */}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Current Temperature: {currentTemperature}°C
                        </Typography>
                        <Button onClick={() => setOpen(false)} sx={{ mr: 2 }} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSave} disabled={saving || !startDate || !endDate}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}