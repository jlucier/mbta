<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { fetchWeather, tempColor } from "./weather";

  let unit = $state<"F" | "C">("F");

  function leadingZero(val: number) {
    return ("" + val).padStart(2, "0");
  }

  function formatHour(d: Date) {
    return `${leadingZero(d.getHours())}:00`;
  }

  function displayTemp(tempF: number) {
    return Math.round(unit === "F" ? tempF : ((tempF - 32) * 5) / 9);
  }

  const weather = createQuery(() => ({
    queryKey: ["weather"],
    refetchInterval: 300_000,
    queryFn: fetchWeather,
  }));
</script>

{#if weather.isLoading}
  <p>Loading weather...</p>
{:else if weather.isError}
  <p>Weather unavailable</p>
{:else if weather.isSuccess}
  <button
    type="button"
    class="weather-detail"
    onclick={() => (unit = unit === "F" ? "C" : "F")}
    aria-label={`Switch to °${unit === "F" ? "C" : "F"}`}
  >
    <div class="stats">
      <div class="stat-row">
        <h2 class="stat-value">
          <span style={`color: ${tempColor(weather.data.highF)}`}
            >{displayTemp(weather.data.highF)}°</span
          >
          /
          <span style={`color: ${tempColor(weather.data.lowF)}`}
            >{displayTemp(weather.data.lowF)}°</span
          >
        </h2>
      </div>
      <div
        class="stat-row precip"
        class:medium={weather.data.precipChance >= 20 &&
          weather.data.precipChance < 50}
        class:high={weather.data.precipChance >= 50}
      >
        <h2 class="stat-value">☔ {weather.data.precipChance}%</h2>
      </div>
    </div>

    <hr class="divider" />

    <div class="hourly">
      {#each weather.data.hourly as h}
        <div class="hour-row">
          <small class="hour-time">{formatHour(h.time)}</small>
          <div class="hour-condition">
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}.png`}
              alt=""
              class="hour-icon"
            />
            <span class="hour-temp" style={`color: ${tempColor(h.tempF)}`}
              >{displayTemp(h.tempF)}°</span
            >
          </div>
        </div>
      {/each}
    </div>
  </button>
{/if}

<style>
  .weather-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    text-align: inherit;
    padding: 0;
    cursor: pointer;
  }
  .weather-detail:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1em;
  }
  .divider {
    width: 80%;
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.2;
    margin: 0.75em 0;
  }
  .stats {
    display: flex;
    flex-direction: column;
    width: 80%;
    gap: 0.5em;
  }
  .stat-row {
    display: flex;
    align-items: center;
    justify-content: center;
    color: gray;
  }
  .stat-value {
    font-size: 60px;
    margin: 0;
  }
  .precip.medium {
    color: #3d9bff;
  }
  .precip.high {
    color: #1a63d1;
  }
  .hourly {
    display: flex;
    flex-direction: column;
    width: 80%;
  }
  .hour-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid gray;
    padding: 0.3em 0.75em;
  }
  .hour-row:last-child {
    border-bottom: none;
  }
  .hour-condition {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }
  small.hour-time {
    font-size: 34px;
  }
  .hour-icon {
    height: 36px;
    filter: brightness(0) invert(1);
  }
  .hour-temp {
    font-size: 34px;
    min-width: 3em;
    text-align: right;
  }
</style>
