export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeather;
  daily?: DailyWeather;
  daily_units?: DailyUnits;
}


export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
    );

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    return (await res.json()) as WeatherResponse;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}