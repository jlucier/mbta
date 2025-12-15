<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import mbtaLogo from "/mbta.png";
  import Schedule from "./lib/Schedule.svelte";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <main>
    <div class="row" style="justify-content: center">
      <div class="item">
        <img src={mbtaLogo} class="logo" alt="MBTA Logo" />
      </div>
      <div class="item">
        <h1 class="title">MBTA</h1>
      </div>
    </div>

    <Schedule
      line="Green"
      stop="Ball Square"
      notBeforeMins={8}
      filters={{
        "filter[route]": "Green-E",
        "filter[stop]": "place-balsq",
      }}
    />
    <Schedule
      line="Red"
      stop="Davis Square"
      notBeforeMins={12}
      filters={{
        "filter[route]": "Red",
        "filter[stop]": "place-davis",
      }}
    />
    <Schedule
      line="Red"
      stop="Porter Square"
      notBeforeMins={12}
      filters={{
        "filter[route]": "Red",
        "filter[stop]": "place-portr",
      }}
    />

    <div class="card"></div>
  </main>
</QueryClientProvider>

<style>
  .title {
    justify-content: center;
    display: inline;
  }
  .logo {
    height: 4em;
    will-change: filter;
    transition: filter 300ms;
  }
</style>
