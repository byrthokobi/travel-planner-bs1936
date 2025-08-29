'use client'

import { auth } from "@/lib/auth";
import { Button, Container, Typography, Box, TextField, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const fetchCities = async (query: string) => {
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



    const { data: results = [], isFetching, isError } = useQuery({
        queryKey: ["countries", query],
        queryFn: () => fetchCities(query),
        enabled: query.length > 0,
    });

    // if (!session) redirect('/login');
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleLogOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    if (status === "loading") {
        return <CircularProgress />;
    }

    if (status === "unauthenticated") {
        return null;
    }


    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                <Typography variant="h3" component="h4">Welcome to Dashboard!</Typography>
                <Button variant="outlined" onClick={handleLogOut} sx={{ height: "40px" }}>Logout</Button>
            </Box>

            <Box sx={{
                width: "50%",
                margin: "auto"
            }}>
                <Box sx={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '1rem',
                }}>
                    <TextField
                        label="Search Places"
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        fullWidth
                    />
                </Box>

                {isFetching && <CircularProgress sx={{ marginTop: "20px" }} />}
                {isError && <Typography color="error">Failed to fetch cities.</Typography>}

                <List sx={{
                    maxHeight: "400px",
                    overflowX: "hidden",
                    overflowY: "auto",
                    borderRadius: "2",
                    p: "1",
                    backgroundColor: "whitesmoke",
                    display: query.length > 0 ? 'block' : 'none'
                }}>
                    {results.map((country, idx) => (
                        <ListItem
                            key={idx}
                            button
                            onClick={() => router.push(`/destination/${country.name}`)}
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
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};
export default DashboardPage;
