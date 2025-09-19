"use client"

import ModernDatePicker from "@/components/Modern-DatePicker";
import { Box, Modal } from "@mui/material";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface DatePickerModalProps {
    countryName: string;
    currentTemperature: string;
    userId: string | number;
}

export default function DatePickerModal({ countryName, currentTemperature, userId }: DatePickerModalProps) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

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
            const weatherSummary: string = currentTemperature;

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

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || `Failed to save trip: ${response.statusText}`);
                return;
            }

            toast.success("Trip Added Successfully!");
            setOpen(false);
            setStartDate(null);
            setEndDate(null);
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

            <Modal
                open={open} onClose={() => setOpen(false)}
            >
                <Box
                    className="modal-body"
                >
                    <h4 className="modal-text mb-5">
                        Select Trip Dates
                    </h4>

                    <ModernDatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newDate) => setStartDate(newDate)}
                    />

                    <ModernDatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newDate) => setEndDate(newDate)}
                    />


                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ marginRight: "12px" }}
                            className="btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary"
                            disabled={saving || !startDate || !endDate}>
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}