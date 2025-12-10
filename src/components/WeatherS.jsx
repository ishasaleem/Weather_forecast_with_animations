import { useState, useEffect } from "react";
import ".././WeatherAnimations.css";

export default function Weather() {
  const [city, setCity] = useState(localStorage.getItem("lastCity") || "");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const apiKey = "fa7b3cbabc4489afe13bc9f92e1ecdfd";

  async function getWeather() {
    if (!city) return;

    localStorage.setItem("lastCity", city);

    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const resCurrent = await fetch(urlCurrent);
    const jsonCurrent = await resCurrent.json();
    setCurrent(jsonCurrent);

    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const resForecast = await fetch(urlForecast);
    const jsonForecast = await resForecast.json();

    const daily = jsonForecast.list.filter((item, index) => index % 8 === 0);
    setForecast(daily);
  }

  function getBg() {
    if (!current) return darkMode ? "from-gray-900 to-black" : "from-blue-200 to-white";

    const m = current.weather[0].main;

    switch (m) {
      case "Clear":
        return "from-yellow-400 via-orange-500 to-red-600";
      case "Clouds":
        return "from-gray-500 via-gray-600 to-gray-800";
      case "Rain":
        return "from-blue-400 via-blue-600 to-blue-900";
      case "Snow":
        return "from-white via-blue-200 to-blue-500";
      default:
        return "from-indigo-800 to-black";
    }
  }

  return (
    <div className={`min-h-screen relative flex items-center justify-center bg-gradient-to-br ${getBg()}`}>

      {/* ----- Animated Weather Layers ----- */}
      {current && current.weather[0].main === "Clouds" && <div className="clouds"></div>}
      {current && current.weather[0].main === "Rain" && <div className="rain"></div>}
      {current && current.weather[0].main === "Snow" && <div className="snow"></div>}

      {/* ----- Card ----- */}
      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-white">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-lg"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <h1 className="text-4xl font-bold text-center mb-8">
          Weather App
        </h1>

        {/* Search Bar */}
        <div className="flex gap-3">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className="flex-1 p-3 rounded-xl bg-white/20 outline-none text-white placeholder-gray-300"
          />

          <button onClick={getWeather} className="bg-blue-600 px-6 rounded-xl font-bold">
            Go
          </button>
        </div>

        {/* ------- Current Weather ------- */}
        {current && (
          <div className="text-center mt-10">

            <h2 className="text-3xl font-bold">{current.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
              className="mx-auto mt-4"
            />

            <p className="text-7xl font-extrabold mt-4">
              {current.main.temp}°C
            </p>

            <p className="capitalize text-gray-200 mt-2">
              {current.weather[0].description}
            </p>

            {/* Details */}
            <div className="grid grid-cols-3 gap-4 mt-8">

              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-gray-300 text-sm">Humidity</p>
                <p className="font-bold">{current.main.humidity}%</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-gray-300 text-sm">Wind</p>
                <p className="font-bold">{current.wind.speed} m/s</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-gray-300 text-sm">Pressure</p>
                <p className="font-bold">{current.main.pressure} hPa</p>
              </div>

            </div>
          </div>
        )}

        {/* ------- Forecast ------- */}
        {forecast && (
          <div className="mt-10">

            <h3 className="text-xl font-bold mb-4">5 Day Forecast</h3>

            <div className="grid grid-cols-5 gap-3">

              {forecast.map((day, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-xl text-center">

                  <p className="text-sm text-gray-300">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    className="mx-auto mt-1"
                  />

                  <p className="font-bold mt-2">{day.main.temp}°C</p>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
