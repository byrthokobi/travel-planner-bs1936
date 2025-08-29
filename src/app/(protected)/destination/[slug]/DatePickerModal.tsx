"use client"

import { Box, Button, Modal, Typography } from "@mui/material";
import { DatePicker, DateRange, DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface DatePickerModalProps {
    countryName: string;
    lat: number;
    lon: number;
    userId: string | number;
}

export default function DatePickerModal({ countryName, lat, lon, userId }: DatePickerModalProps) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchWeather = async () => {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
            );
            const data = await res.json();
            return data?.current_weather?.temperature ?? "N/A";
        } catch (err) {
            console.error("Failed to fetch weather:", err);
            return "N/A";
        }
    };
    const handleSave = async () => {
        if (!startDate || !endDate) return alert("Please select both Start and End Dates");
        if (endDate.isBefore(startDate)) return alert("End Date cannot be before Start Date");

        setSaving(true);
        const weatherSummary = await fetchWeather();
        await fetch("/api/trips", {
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

        setSaving(false);
        setOpen(false);
        setStartDate(null);
        setEndDate(null);
    }

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ mt: 2, width: "50%" }}>
                Add Destination
            </Button>

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

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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