"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function WeatherChart({ forecast }: { forecast: any }) {

    const data = forecast.time.map((date: string, i: number) => ({
        date,
        max: forecast.temperature_2m_max[i],
        min: forecast.temperature_2m_min[i]
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="max" stroke="#ff7300" name="Max Temp" />
                <Line type="monotone" dataKey="min" stroke="#387908" name="Min Temp" />
            </LineChart>
        </ResponsiveContainer>
    );
}
