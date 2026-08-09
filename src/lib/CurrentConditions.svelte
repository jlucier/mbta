<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { fetchWeather, tempColor } from "./weather";

  const weather = createQuery(() => ({
    queryKey: ["weather"],
    refetchInterval: 300_000,
    queryFn: fetchWeather,
  }));

  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
</script>

{#if weather.isSuccess}
  <div class="current-conditions">
    <img
      src={`https://openweathermap.org/img/wn/${weather.data.icon}@2x.png`}
      alt={weather.data.condition}
      class="conditions-icon"
    />
    <div>
      <h1
        class="conditions-temp"
        style={`color: ${tempColor(weather.data.currentTempF)}`}
      >
        {Math.round(weather.data.currentTempF)}°F
      </h1>
      <h4 class="conditions-description">
        {capitalize(weather.data.condition)}
      </h4>
    </div>
  </div>
{/if}

<style>
  .current-conditions {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }
  .conditions-icon {
    height: 84px;
    margin-right: -1em;
    filter: brightness(0) invert(1);
  }
  .conditions-temp {
    font-size: 64px;
    margin: 0;
    text-align: left;
  }
  .conditions-description {
    margin: 0;
    color: gray;
    text-align: left;
  }
</style>
