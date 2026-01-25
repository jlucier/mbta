<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import mbtaLogo from "/mbta.png";
  import Schedule from "./lib/Schedule.svelte";
  import CurrentTime from "./lib/CurrentTime.svelte";
  import Weather from "./lib/Weather.svelte";

  const queryClient = new QueryClient();

  var multi = $state(false);
</script>

<QueryClientProvider client={queryClient}>
  <main>
    <div
      class="row"
      style="justify-content: space-between; align-items: center"
    >
      <div class="item">
        <button
          class="logo-btn row"
          onclick={() => {
            multi = !multi;
          }}
        >
          <div class="item">
            <img src={mbtaLogo} class="logo" alt="MBTA Logo" />
          </div>
          <div class="item">
            <h1 class="title">MBTA</h1>
          </div>
        </button>
      </div>
      <div class="item">
        <Weather />
      </div>
      <div class="item">
        <CurrentTime />
      </div>
    </div>

    <div class="schedule">
      <Schedule
        {multi}
        line="Green"
        stop="Ball Square"
        notBeforeMins={7}
        filters={{
          "filter[route]": "Green-E",
          "filter[stop]": "place-balsq",
        }}
      />
    </div>
    <div class="schedule">
      <Schedule
        {multi}
        line="Red"
        stop="Davis Square"
        notBeforeMins={12}
        filters={{
          "filter[route]": "Red",
          "filter[stop]": "place-davis",
        }}
      />
    </div>
    <div class="schedule">
      <Schedule
        {multi}
        line="Red"
        stop="Porter Square"
        notBeforeMins={12}
        filters={{
          "filter[route]": "Red",
          "filter[stop]": "place-portr",
        }}
      />
    </div>
  </main>
</QueryClientProvider>

<style>
  .logo-btn {
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    cursor: pointer;
    padding: 0.5em;
    border-radius: 0.5em;
    color: inherit;
  }
  .logo-btn:active {
    background: rgba(255, 255, 255, 0.25);
  }
  .title {
    justify-content: center;
    display: inline;
  }
  .logo {
    height: 3em;
    will-change: filter;
    transition: filter 300ms;
  }
  .schedule {
    margin-bottom: 1em;
  }
</style>
