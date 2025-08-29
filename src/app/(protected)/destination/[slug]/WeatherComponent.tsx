"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Thermometer } from 'lucide-react';

export default function WeatherChart({ forecast }: { forecast: any }) {
    const data = forecast.time.map((date: string, i: number) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        max: forecast.temperature_2m_max[i],
        min: forecast.temperature_2m_min[i]
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white rounded-lg shadow-lg border p-3">
                    <p className="text-gray-800 font-medium mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}°C
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const avgTemp = Math.round(data.reduce((sum, item) => sum + (item.max + item.min) / 2, 0) / data.length);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <Thermometer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Weather Forecast</h3>
                        <p className="text-gray-500 text-sm">Temperature outlook</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{avgTemp}°C</div>
                    <div className="text-gray-500 text-sm">average</div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="max"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        name="Max Temp"
                        dot={{ fill: '#f97316', strokeWidth: 2, stroke: '#fff', r: 4 }}
                        activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                        fill="url(#maxGradient)"
                    />
                    <Line
                        type="monotone"
                        dataKey="min"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        name="Min Temp"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, stroke: '#fff', r: 4 }}
                        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                        fill="url(#minGradient)"
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Simple Legend */}
            <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-gray-600 text-sm">Max Temp</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-gray-600 text-sm">Min Temp</span>
                </div>
            </div>
        </div>
    );
}