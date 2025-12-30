<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  var now = $state(new Date());
  var timer = null;

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
</script>

<h1 class="time-text">
  {leadingZero(now.getHours() % 12)}:{leadingZero(now.getMinutes())}
  {now.getHours() < 12 ? "AM" : "PM"}
</h1>

<style>
  .time-text {
    font-size: 72px;
    margin: 0.5em;
  }
</style>
