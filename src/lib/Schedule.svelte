<script lang="ts">
  import _ from "lodash";
  import { createQuery } from "@tanstack/svelte-query";
  import { getSchedule, getPredictions } from "./api";
  import TrainCard from "./TrainCard.svelte";
  import type { Prediction, Schedule } from "./api";

  type SchedItem = Prediction | Schedule;

  const {
    line,
    stop,
    filters: baseFilters,
    multi = false,
    notBeforeMins = 10,
  } = $props();

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

<div>
  <div class={`row line-row ${multi ? "" : "huge"}`}>
    {#if multi}
      <div>
        <div class={`chip ${line === "Red" ? "red" : "green"}`}>
          <b>{line}</b>
        </div>
      </div>
    {/if}
    <div
      class={`row line-row ${multi ? "" : `chip ${line === "Red" ? "red" : "green"}`}`}
    >
      <h2>
        {multi ? stop : stop.split(" ")[0]}
      </h2>
      <small style={`font-size: 0.7em; ${multi ? "color: gray;" : ""}`}>
        <b>&nbsp;- {notBeforeMins} min</b>
      </small>
    </div>
    {#if !multi && data.isSuccess}
      {#if data.data.length === 0}
        <h2>No trains</h2>
      {:else}
        <div class="row trains-compact">
          {#each data.data.slice(0, 2) as item}
            <div>
              <TrainCard twoLine {item} soon={notBeforeMins + 2} />
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  {#if data.isLoading}
    <p>Loading...</p>
  {:else if data.isError}
    <p>Error: {data.error.message}</p>
  {/if}

  {#if multi && data.isSuccess}
    {#if data.data.length}
      <div class="row schedule">
        {#each data.data as item}
          <div style="margin-right: 1em;">
            <TrainCard {item} soon={notBeforeMins + 2} />
          </div>
        {/each}
      </div>
    {:else}
      <h2>No trains</h2>
    {/if}
  {/if}
</div>

<style>
  .line-row.huge {
    justify-content: space-between;
  }
  .chip {
    border-radius: 1em;
    padding: 0em 0.75em;
    margin-right: 0.5em;
  }
  .line-row {
    align-items: center;
    justify-content: flex-start;
  }
  .schedule {
    max-width: 100vw;
    overflow-x: scroll;
  }
  .trains-compact {
    gap: 0.5em;
  }
</style>
