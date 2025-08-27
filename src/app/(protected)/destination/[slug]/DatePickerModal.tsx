"use client"

import { Box, Button, Modal, Typography } from "@mui/material";
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface DatePickerModalProps {
    countryName: string;
    lat: number;
    lon: number;
}

export default function DatePickerModal({ countryName, lat, lon }: DatePickerModalProps) {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState<DateRange<Dayjs>>([null, null]);

    const fetchWeather = async (lat: number, lon: number) => {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
        );
        const data = await res.json();
        return data?.current_weather?.temperature;
    };
    const handleSave = async () => {
        if (range[0] && range[1]) {

            let weatherSummary = null;
            try {
                weatherSummary = await fetchWeather(lat, lon) + "°C";
            } catch (err) {
                console.error("Failed to fetch weather", err);
            }

            const trips = JSON.parse(localStorage.getItem("trips") || "[]");
            trips.push({
                country: countryName,
                startDate: range[0].format("YYYY-MM-DD"),
                endDate: range[1].format("YYYY-MM-DD"),
                weatherSummary
            });

            localStorage.setItem("trips", JSON.stringify(trips));
            setOpen(false);
        } else {
            alert("Please Select Start and End Dates");
        }
    }

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Add Destination
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6">Select Trip Dates</Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                            value={range}
                            onChange={(newRange) => setRange(newRange)}
                            slotProps={{
                                textField: {
                                    helperText: "",
                                },
                            }}
                        />
                    </LocalizationProvider>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}