import { notFound } from "next/navigation";
export async function getCountryData(countryName: string) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await res.json();
        console.log(data);
        const country = data[0];
        return {
            name: country?.name?.common,
            capital: country?.capital,
            population: country?.population,
            timezone: country?.timezones?.[0] || "N/A",
            flag: country?.flags?.png || "",
            lat: country?.latlng?.[0],
            lon: country?.latlng?.[1]
        }
    } catch (err) {
        console.error(err);
        notFound();
    }
}