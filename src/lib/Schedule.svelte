<script lang="ts">
  import _ from "lodash";
  import { createQuery } from "@tanstack/svelte-query";
  import { getSchedule, getPredictions } from "./api";
  import TrainCard from "./TrainCard.svelte";
  import type { Prediction, Schedule } from "./api";

  type SchedItem = Prediction | Schedule;

  const { line, stop, filters: baseFilters, notBeforeMins = 10 } = $props();

  function apiDate(d: Date) {
    return _.join(
      [
        d.getFullYear(),
        _.padStart("" + (d.getMonth() + 1), 2, "0"),
        _.padStart("" + d.getDate(), 2, "0"),
      ],
      "-",
    );
  }

  const data = createQuery(() => ({
    refetchInterval: 30_000,
    queryKey: [`schedule-${line}-${stop}`],
    queryFn: async (): Promise<SchedItem[]> => {
      const date = new Date();
      const nbf = new Date(+date + (notBeforeMins - 1) * 60_000);
      const end = new Date(+date + (30 + notBeforeMins) * 60 * 1000);

      const filters = {
        ...baseFilters,
        "filter[direction_id]": "0",
        sort: "arrival_time",
        "page[limit]": "5",
      };

      const pred = _.filter(
        (await getPredictions(filters)).data,
        (p) => p.attributes.arrival_time >= nbf,
      );

      const sched = (
        await getSchedule({
          ...filters,
          "filter[date]": apiDate(date),
          "filter[min_time]": nbf.toTimeString().substring(0, 5),
          "filter[max_time]": end.toTimeString().substring(0, 5),
        })
      ).data;

      for (const p of pred) {
        for (var j = 0; j < sched.length; j++) {
          const s = sched[j];
          // replace the schedule with prediction when present
          if (s.relationships.trip?.data.id === p.relationships.trip?.data.id) {
            sched[j] = p;
          }
        }
      }
      return _.sortBy(sched, "attributes.arrival_time");
    },
  }));
</script>

<div class="schedule-column huge">
  <div class={`chip ${line === "Red" ? "red" : "green"}`}>
    <h2 class="stop-name">{stop.split(" ")[0]}</h2>
  </div>

  {#if data.isLoading}
    <p>Loading...</p>
  {:else if data.isError}
    <p>Error: {data.error.message}</p>
  {:else if data.isSuccess}
    {#if data.data.length === 0}
      <h2>No trains</h2>
    {:else}
      <div class="trains-stack">
        {#each data.data.slice(0, 3) as item}
          <TrainCard {item} soon={notBeforeMins + 2} />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .schedule-column {
    display: flex;
    flex-direction: column;
  }
  .chip {
    align-items: center;
    justify-content: center;
    border-radius: 1em;
    padding: 0em 0.75em;
    margin-bottom: 0.5em;
    display: flex;
  }
  .stop-name {
    font-size: 56px;
  }
  .trains-stack {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
</style>
