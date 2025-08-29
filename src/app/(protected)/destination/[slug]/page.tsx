import { Grid3x3 } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import WeatherChart from "./WeatherComponent";
import DatePickerModal from "./DatePickerModal";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, Flag, MapPin, Users } from "lucide-react";

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

    const session = await auth();
    if (!session) {
        redirect("/login"); // Redirect non-logged-in users
    }
    const { slug } = await params;
    const countryName = decodeURIComponent(slug);
    const userId = session?.user?.id;

    const country = await getCountryData(countryName);

    let weatherData: any = null;
    if (country.lat && country.lon) {
        weatherData = await getWeather(country.lat, country.lon);
    }
    return (
        <Container>
            <Box sx={{
                marginTop: '12px'
            }}>
                <Typography variant="h4">
                    Welcome to the beautiful country named {countryName} !
                </Typography>
            </Box>

            {/* Country Details Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8 hover:shadow-xl transition-shadow duration-300">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Country Details</h2>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Country Info */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Country Name */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Flag className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Country Name</p>
                                <p className="text-lg font-semibold text-gray-800">{country.name}</p>
                            </div>
                        </div>

                        {/* Population */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Population</p>
                                <p className="text-lg font-semibold text-gray-800">{country.population.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Timezone */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Timezone</p>
                                <p className="text-lg font-semibold text-gray-800">{country.timezone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Flag Section */}
                    <div className="flex flex-col items-center justify-center">
                        {country.flag ? (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                                    <img
                                        src={country.flag}
                                        alt={`${country.name} flag`}
                                        className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg shadow-sm"
                                    />
                                </div>
                                <div className="text-center mt-3">
                                    <p className="text-sm font-medium text-gray-600">National Flag</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-24 h-16 sm:w-32 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Flag className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Bar (Optional Enhancement) */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-2xl font-bold text-blue-600">{country.name.length}</p>
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Name Length</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <p className="text-2xl font-bold text-green-600">
                                {(country.population / 1000000).toFixed(1)}M
                            </p>
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Population (M)</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <p className="text-2xl font-bold text-purple-600">
                                {country.timezone.split('/').length > 1 ? country.timezone.split('/')[1] : country.timezone}
                            </p>
                            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Time Zone</p>
                        </div>
                    </div>
                </div>
            </div>

            <DatePickerModal countryName={countryName} lat={country.lat} lon={country.lon} userId={Number(userId)} />

            {/* Weather Section */}
            {weatherData && (
                <Card sx={{ marginTop: 4 }}>
                    <CardContent>
                        <Typography variant="h5">Weather Forecast</Typography>
                        <Typography>Current: {weatherData.current_weather.temperature}°C</Typography>
                        <WeatherChart forecast={weatherData.daily} />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}