import React, { useState, useEffect } from "react";

const Weather = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please allow location access.");
        setLoading(false);
      }
    );
  }, []);

  // Step 2: Fetch weather once location is available
  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather data.");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coords]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading weather data...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  if (!weather) {
    return <p style={{ padding: "20px" }}>No weather data available.</p>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "white", color: "black" }}>
      <h1>🌤️ Local Weather</h1>
      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> {weather.windspeed} km/h</p>
      <p><strong>Wind Direction:</strong> {weather.winddirection}°</p>
      <p><strong>Time:</strong> {weather.time}</p>
    </div>
  );
};

export default Weather;
