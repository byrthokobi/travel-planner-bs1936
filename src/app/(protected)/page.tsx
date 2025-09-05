'use client'

import { Button, Container, Typography, Box, TextField, CircularProgress, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Country {
    name: string;
    officitalName: string;
    capital: string;
    region: string;
    flag: string;
}


const fetchCountries = async (query: string): Promise<(Country[])> => {
    if (!query) return [];
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);

        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];

        const countries = data.map((country: any) => ({
            name: country.name.common,
            officitalName: country.name.official,
            capital: country.capital ? country.capital[0] : "N/A",
            region: country.region,
            flag: country.flags?.png || "",
        }));

        return countries.sort((a, b) => {
            const q = query.toLowerCase();

            const aStarts = a.name.toLowerCase().startsWith(q);
            const bStarts = b.name.toLowerCase().startsWith(q);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error("Failed to Fetch Countries: " + error);
        return [];
    }
}

const DashboardPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [navigating, setNavigating] = useState(false);


    const { data: results = [], isFetching, isError } = useQuery({
        queryKey: ["countries", initialQuery],
        queryFn: () => fetchCountries(initialQuery),
        enabled: initialQuery.length > 0,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";

            if (query !== currentQ) {
                if (query.trim() === "") {
                    router.push("/");
                } else {
                    router.push(`?q=${query}`);
                }
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query, router, searchParams]);

    if (status === "loading") {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
                <h2 className="text-xl md:text-2xl lg:text-3xl">Plan Your Next Trip!</h2>
            </Box>

            <Box className="destination-search-box" sx={{ margin: 'auto', marginTop: 5 }}>
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
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: "black", // light mode
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "blue", // focused state
                            },
                            ".dark & .MuiInputLabel-root": {
                                color: "white", // dark mode
                            },
                            ".dark & .MuiInputLabel-root.Mui-focused": {
                                color: "white", // focused in dark mode
                            },
                            ".dark & .MuiOutlinedInput-input": {
                                color: "white", // dark mode text
                            },
                        }}
                    />
                </Box>

                {isFetching && <CircularProgress sx={{ marginTop: "20px" }} />}
                {isError && <Typography color="error">Failed to fetch countries.</Typography>}

                <List className="country-list" sx={{
                    display: query.length > 0 ? 'block' : 'none',
                    filter: navigating ? "blur(4px)" : "none",
                    pointerEvents: navigating ? "none" : "auto",
                }}>
                    {results && results.length > 0 ? (results.map((country: Country, idx) => (
                        <ListItemButton
                            key={idx}
                            onClick={() => {
                                setNavigating(true);
                                router.push(`/destination/${country.name}`)
                            }
                            }
                            className="country-list-item"
                        >
                            <div>
                                <h5>{country?.name}</h5>
                                <p>{`Capital: ${country?.capital},
                                Region: ${country.region}, 
                                Official Name: ${country?.officitalName}`}</p>
                            </div>
                            {country.flag && (
                                <img
                                    src={country.flag}
                                    alt={country.name}
                                    style={{ width: "30px", marginLeft: "10px" }}
                                />
                            )}
                        </ListItemButton>
                    ))) : <p className="text-bold text-red-500">"Country Not Found"</p>}
                </List>
            </Box>
        </Container >
    );
};
export default DashboardPage;
