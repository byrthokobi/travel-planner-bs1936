'use client'

import { auth } from "@/lib/auth";
import { Button, Container, Typography, Box, TextField, CircularProgress, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Country {
    name: string;
    capital: string;
    region: string;
    flag: string;
}


const fetchCities = async (query: string): Promise<(Country[])> => {
    if (!query) return [];
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    const data = await res.json();
    return data.map((country: any) => ({
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        region: country.region,
        flag: country.flags?.png || "",
    }));
}

const DashboardPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [navigating, setNavigating] = useState(false);

    const { data: results = [], isFetching, isError } = useQuery({
        queryKey: ["countries", query],
        queryFn: () => fetchCities(query),
        enabled: query.length > 0,
    });

    if (status === "loading") {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                <h2 className="text-xl md:text-2xl lg:text-3xl">Plan Your Next Trip!</h2>
            </Box>

            <Box className="travel-input" sx={{ margin: 'auto', marginTop: 5 }}>
                <Box sx={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '1rem',
                }}>
                    <TextField
                        label="Find Your Next Destination"
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        fullWidth
                    />
                </Box>

                {isFetching && <CircularProgress sx={{ marginTop: "20px" }} />}
                {isError && <Typography color="error">Failed to fetch cities.</Typography>}

                <List className="country-list" sx={{
                    display: query.length > 0 ? 'block' : 'none',
                    filter: navigating ? "blur(4px)" : "none",
                    "pointer-events": navigating ? "none" : "auto",
                }}>
                    {results.map((country: Country, idx) => (
                        <ListItemButton
                            key={idx}
                            onClick={() => {
                                setNavigating(true);
                                router.push(`/destination/${country.name}`)
                            }
                            }
                            sx={{ cursor: "pointer" }}
                        >
                            <ListItemText
                                primary={country.name}
                                secondary={`Capital: ${country.capital}, Region: ${country.region}`}
                            />
                            {country.flag && (
                                <img
                                    src={country.flag}
                                    alt={country.name}
                                    style={{ width: "30px", marginLeft: "10px" }}
                                />
                            )}
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Container >
    );
};
export default DashboardPage;
