<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  var now = $state(new Date());
  var timer: number | null = null;

  onMount(() => {
    timer = setInterval(() => (now = new Date()), 60000);
  });
  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  function leadingZero(val: number, target: number = 2) {
    const s = "" + val;
    return s.padStart(target, "0");
  }

  function formatHour(val: number) {
    return val > 12 ? val - 12 : val;
  }
</script>

<h1 class="time-text">
  {leadingZero(formatHour(now.getHours()))}:{leadingZero(now.getMinutes())}
  {now.getHours() < 12 ? "AM" : "PM"}
</h1>

<style>
  .time-text {
    font-size: 72px;
    margin: 0.5em;
  }
</style>
