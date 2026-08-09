<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import Schedule from "./lib/Schedule.svelte";
  import CurrentTime from "./lib/CurrentTime.svelte";
  import CurrentConditions from "./lib/CurrentConditions.svelte";
  import Weather from "./lib/Weather.svelte";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <main>
    <div
      class="row"
      style="justify-content: space-between; align-items: center"
    >
      <div class="item">
        <CurrentTime />
      </div>
      <div class="item">
        <CurrentConditions />
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <Schedule
          line="Green"
          stop="Ball Square"
          notBeforeMins={7}
          filters={{
            "filter[route]": "Green-E",
            "filter[stop]": "place-balsq",
          }}
        />
      </div>
      <div class="column">
        <Schedule
          line="Red"
          stop="Davis Square"
          notBeforeMins={12}
          filters={{
            "filter[route]": "Red",
            "filter[stop]": "place-davis",
          }}
        />
      </div>
      <div class="column weather-column huge">
        <Weather />
      </div>
    </div>
  </main>
</QueryClientProvider>

<style>
  .columns {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 2em;
  }
  .column {
    flex: 1;
    min-width: 0;
  }
  .weather-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
</style>
