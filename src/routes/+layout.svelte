<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.png';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let { children } = $props();

  // Register Service Worker for PWA
  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${base}/sw.js`).then(
        (registration) => {
          console.log('SW registered:', registration.scope);
        },
        (error) => {
          console.log('SW registration failed:', error);
        }
      );
    }
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
