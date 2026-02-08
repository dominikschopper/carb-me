<script lang="ts">
  import '$lib/styles/app.css';
  import favicon from '$lib/assets/favicon.png';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { swStore } from '$lib/stores/serviceWorker.svelte';
  import UpdateNotification from '$lib/components/UpdateNotification.svelte';

  let { children } = $props();

  onMount(() => {
    swStore.init(base);
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<UpdateNotification />

{@render children()}
