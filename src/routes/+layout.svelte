<script lang="ts">
  import '$lib/styles/app.css';
  import favicon from '$lib/assets/favicon.png';
  import { onMount } from 'svelte';
  import { swStore } from '$lib/features/update/serviceWorker.svelte';
  import UpdateNotification from '$lib/features/update/UpdateNotification.svelte';

  let { children } = $props();

  onMount(() => {
    swStore.init();
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<UpdateNotification />

{@render children()}
