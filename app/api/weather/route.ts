/** @format */

import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: Request) {
	console.log("++++ GET request", request);
	const { searchParams } = new URL(request.url);
	const location = searchParams.get("location");
	const format = searchParams.get("format") || "celsius";

	if (!location) {
		return NextResponse.json(
			{ error: "Location is required" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`${BASE_URL}?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=${
				format === "celsius" ? "metric" : "imperial"
			}`
		);
		console.log("++++ response", response);
		const data = await response.json();
		console.log("++++ data", data);

		if (data.cod !== 200) {
			throw new Error(data.message);
		}
		console.log("++++ data name", data.name);
		console.log("++++ data main temp", data.main.temp);
		console.log("++++ data weather condition", data.weather[0].main);
		console.log("++++ data weather description", data.weather[0].description);
		return NextResponse.json({
			location: data.name,
			temperature: data.main.temp,
			condition: data.weather[0].main,
			description: data.weather[0].description,
		});
	} catch (error) {
		console.error("Error fetching weather:", error);
		return NextResponse.json(
			{ error: "Failed to fetch weather data" },
			{ status: 500 }
		);
	}
}
