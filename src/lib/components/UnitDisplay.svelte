<script lang="ts">
  import { settingsStore } from '$lib/stores/settings.svelte';

  interface Props {
    beContent?: import('svelte').Snippet;
    kheContent?: import('svelte').Snippet;
  }

  let { beContent, kheContent }: Props = $props();

  const preferredUnit = $derived(settingsStore.settings.preferredUnit);
</script>

{#if preferredUnit === 'BE'}
  {@render beContent?.()}
{:else}
  {@render kheContent?.()}
{/if}
