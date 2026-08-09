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

  function formatDate(d: Date) {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
</script>

<h1 class="time-text">
  {leadingZero(now.getHours())}:{leadingZero(now.getMinutes())}
  <span class="date-text">{formatDate(now)}</span>
</h1>

<style>
  .time-text {
    font-size: 72px;
    margin: 0.25em 0;
  }
  .date-text {
    font-size: 0.6em;
    color: gray;
  }
</style>
