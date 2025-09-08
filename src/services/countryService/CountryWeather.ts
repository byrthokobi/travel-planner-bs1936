export async function getWeather(lat: number, lon: number) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
        );
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}