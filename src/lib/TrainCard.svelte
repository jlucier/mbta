<script lang="ts">
  import _ from "lodash";
  import type { Prediction, Schedule } from "./api";

  interface Props {
    item: Prediction | Schedule;
    soon?: number;
  }
  const { item, soon = 10 }: Props = $props();

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

<div class="card">
  <h2 class="time">
    <span class={textClass(item)}
      >{inMins(item.attributes.arrival_time)} <small>min</small></span
    >
  </h2>
  <h4 class="arrival-time">
    @ {item.attributes.arrival_time.toTimeString().substring(0, 8)}
  </h4>
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
  .arrival-time {
    color: gray;
  }
</style>
