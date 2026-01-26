<script lang="ts">
  import _ from "lodash";
  import type { Prediction, Schedule } from "./api";
  import { isPrediction } from "./api";

  interface Props {
    item: Prediction | Schedule;
    soon?: number;
    twoLine?: boolean;
  }
  const { item, soon = 10, twoLine = false }: Props = $props();

  function textClass(item: Prediction | Schedule) {
    const delta = +item.attributes.arrival_time - +new Date();
    if (delta < 0) {
      return "gone";
    } else if (delta < soon * 60_000) {
      return "soon";
    }
    return "";
  }

  function inMins(d: Date) {
    const delta = +d - +new Date();
    return _.round(delta / 1000 / 60, 1);
  }
</script>

<div class="card" class:two-line={twoLine}>
  <div class={!twoLine ? "center-row" : ""}>
    <h2 class="time">
      <span class={textClass(item)}
        >{inMins(item.attributes.arrival_time)} <small>min</small></span
      >
    </h2>
    <h4>
      {#if !twoLine}
        @ {item.attributes.arrival_time.toTimeString().substring(0, 8)}
      {/if}
      {#if isPrediction(item)}
        ({item.attributes.arrival_uncertainty === 60
          ? "En Route"
          : item.attributes.arrival_uncertainty === 120
            ? "Awaiting"
            : "No Train"})
      {/if}
    </h4>
  </div>
</div>

<style>
  .soon {
    color: orange;
  }
  .gone {
    color: red;
  }
  .card {
    min-width: 290px;
    padding: 0.2em;
    border: gray;
    border-width: 2px;
    border-style: solid;
    border-radius: 12px;
  }
  .center-row {
    display: flex;
    direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .two-line {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }
</style>
