"use client";

import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Box
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Trip {
    country: string;
    startDate: string;
    endDate: string;
    weatherSummary?: string;
}

export default function ItineraryPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "startDate",
        direction: "asc"
    });

    // Load trips from localStorage safely
    useEffect(() => {
        const storedTrips = JSON.parse(localStorage.getItem("trips") || "[]");
        setTrips(storedTrips);
    }, []);

    // Sort trips based on config
    const sortedTrips = [...trips].sort((a, b) => {
        const { key, direction } = sortConfig;
        let comparison = 0;
        if (key === "startDate") {
            comparison =
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        } else if (key === "country") {
            comparison = a.country.localeCompare(b.country);
        }
        return direction === "asc" ? comparison : -comparison;
    });

    const toggleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc"
                };
            }
            return { key, direction: "asc" };
        });
    };

    // Remove trip
    const handleRemove = (index: number) => {
        const updatedTrips = [...trips];
        updatedTrips.splice(index, 1);
        setTrips(updatedTrips);
        localStorage.setItem("trips", JSON.stringify(updatedTrips));
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Your Saved Trips
            </Typography>

            {trips.length === 0 ? (
                <Typography>No trips saved yet.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Destination
                                <IconButton size="small" onClick={() => toggleSort("country")}>
                                    {sortConfig.key === "country" && sortConfig.direction === "asc" ? (
                                        <ArrowUpwardIcon fontSize="inherit" />
                                    ) : (
                                        <ArrowDownwardIcon fontSize="inherit" />
                                    )}
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                Start Date
                                <IconButton size="small" onClick={() => toggleSort("startDate")}>
                                    {sortConfig.key === "startDate" && sortConfig.direction === "asc" ? (
                                        <ArrowUpwardIcon fontSize="inherit" />
                                    ) : (
                                        <ArrowDownwardIcon fontSize="inherit" />
                                    )}
                                </IconButton>
                            </TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Weather Summary</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTrips.map((trip, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{trip.country}</TableCell>
                                <TableCell>{trip.startDate}</TableCell>
                                <TableCell>{trip.endDate}</TableCell>
                                <TableCell>{trip.weatherSummary || "N/A"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemove(idx)}
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Container>
    );
}
