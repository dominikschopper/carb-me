<script lang="ts">
  let { message }: { message: string } = $props();
</script>

{#if message}
  <div class="success-toast">
    <span class="material-symbols-outlined success-toast__icon">check_circle</span>
    {message}
  </div>
{/if}

<style>
  .success-toast {
    position: fixed;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    border-radius: var(--radius-lg);
    background-color: var(--color-success);
    padding: var(--space-xs) var(--space-md);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-lg);
  }

  .success-toast__icon {
    font-size: 20px;
  }
</style>
