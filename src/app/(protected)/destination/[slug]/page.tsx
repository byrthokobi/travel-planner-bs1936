import { Grid3x3 } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import WeatherChart from "./WeatherComponent";

async function getCountryData(countryName: string) {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await res.json();
    const country = data[0];
    return {
        name: country.name.common,
        population: country.population,
        timezone: country.timezones?.[0] || "N/A",
        flag: country.flags?.png || "",
        lat: country.latlng?.[0],
        lon: country.latlng?.[1]
    }
}

async function getWeather(lat: number, lon: number) {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
    );
    return res.json();
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const countryName = decodeURIComponent(slug);

    const country = await getCountryData(countryName);

    // 2. Fetch weather forecast if lat/lon available
    let weatherData: any = null;
    if (country.lat && country.lon) {
        weatherData = await getWeather(country.lat, country.lon);
    }
    return (
        <Container>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px'
            }}>
                <Typography variant="h4">
                    Welcome to the beautiful country named {countryName} !
                </Typography>
                <Button variant="contained">Add Destination</Button>
            </Box>

            {/* Country Details Section */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <Typography variant="h5">Country Details</Typography>
                    <Grid container spacing={2} sx={{ marginTop: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography>Name: {country.name}</Typography>
                            <Typography>Population: {country.population.toLocaleString()}</Typography>
                            <Typography>Timezone: {country.timezone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {country.flag && <img src={country.flag} alt={country.name} style={{ width: "100px" }} />}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Weather Section */}
            {weatherData && (
                <Card sx={{ marginTop: 4 }}>
                    <CardContent>
                        <Typography variant="h5">Weather Forecast</Typography>
                        <Typography>Current: {weatherData.current_weather.temperature}°C</Typography>
                        {/* Pass forecast to a client component chart */}
                        <WeatherChart forecast={weatherData.daily} />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}