<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  const API_KEY = import.meta.env.VITE_OWM_API_KEY;
  const LAT = 42.3954;
  const LON = -71.1225;

  interface WeatherResponse {
    main: { temp: number };
    weather: { icon: string; description: string }[];
  }

  const weather = createQuery(() => ({
    queryKey: ["weather"],
    refetchInterval: 300_000,
    queryFn: async (): Promise<WeatherResponse> => {
      const params = new URLSearchParams({
        lat: "" + LAT,
        lon: "" + LON,
        appid: API_KEY,
        units: "imperial",
      });
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${params}`,
      );
      if (!resp.ok) throw Error("Weather request failed");
      return resp.json();
    },
  }));
</script>

{#if weather.isSuccess}
  <div class="weather">
    <img
      src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
      alt={weather.data.weather[0].description}
      class="weather-icon"
    />
    <h1 class="temp">{Math.round(weather.data.main.temp)}°F</h1>
  </div>
{/if}

<style>
  .weather {
    display: flex;
    align-items: center;
  }
  .weather-icon {
    height: 6em;
    margin: -1em;
    filter: brightness(0) invert(1);
  }
  .temp {
    font-size: 72px;
  }
</style>
