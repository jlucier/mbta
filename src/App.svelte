<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import mbtaLogo from "/mbta.png";
  import Schedule from "./lib/Schedule.svelte";
  import CurrentTime from "./lib/CurrentTime.svelte";

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
        <div class="row" style="justify-content: center; align-items: center;">
          <div class="item">
            <img src={mbtaLogo} class="logo" alt="MBTA Logo" />
          </div>
          <div class="item">
            <h2 class="title">MBTA</h2>
          </div>
          <div class="item">
            <button
              onclick={() => {
                multi = !multi;
              }}
            >
              {multi ? "Single" : "Multi"}
            </button>
          </div>
        </div>
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
        notBeforeMins={8}
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
