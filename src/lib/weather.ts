const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const LAT = 42.3954;
const LON = -71.1225;
const HOURLY_COUNT = 7;

interface CurrentWeatherResponse {
  main: { temp: number };
  weather: { icon: string; description: string }[];
}

interface ForecastEntry {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { icon: string; description: string }[];
  pop: number;
}

interface ForecastResponse {
  list: ForecastEntry[];
}

export interface HourlyEntry {
  time: Date;
  icon: string;
  tempF: number;
}

export interface WeatherData {
  condition: string;
  icon: string;
  currentTempF: number;
  precipChance: number;
  highF: number;
  lowF: number;
  hourly: HourlyEntry[];
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function fetchWeather(): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: "" + LAT,
    lon: "" + LON,
    appid: API_KEY,
    units: "imperial",
  });

  const [currentResp, forecastResp] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`),
  ]);
  if (!currentResp.ok || !forecastResp.ok) {
    throw Error("Weather request failed");
  }

  const current: CurrentWeatherResponse = await currentResp.json();
  const forecast: ForecastResponse = await forecastResp.json();

  const now = new Date();
  const todays = forecast.list.filter((f) =>
    isSameDay(new Date(f.dt * 1000), now),
  );
  const relevant = todays.length ? todays : forecast.list.slice(0, 1);

  const precipChance = Math.round(
    Math.max(...relevant.map((f) => f.pop)) * 100,
  );

  const temps = relevant.flatMap((f) => [f.main.temp_min, f.main.temp_max]);
  temps.push(current.main.temp);
  const highF = Math.max(...temps);
  const lowF = Math.min(...temps);

  const hourly: HourlyEntry[] = forecast.list
    .slice(0, HOURLY_COUNT)
    .map((f) => ({
      time: new Date(f.dt * 1000),
      icon: f.weather[0].icon,
      tempF: f.main.temp,
    }));

  return {
    condition: current.weather[0].description,
    icon: current.weather[0].icon,
    currentTempF: current.main.temp,
    precipChance,
    highF,
    lowF,
    hourly,
  };
}

export function tempColor(tempF: number) {
  if (tempF < 32) return "#c6e0f7";
  if (tempF < 50) return "#d3ebf5";
  if (tempF < 65) return "#d1e8c2";
  if (tempF < 75) return "#f2e0a6";
  if (tempF < 85) return "#f2c8a0";
  return "#eeae98";
}
