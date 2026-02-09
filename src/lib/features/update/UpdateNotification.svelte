<script lang="ts">
  import { swStore } from './serviceWorker.svelte';
  import { CHANGELOG_URL } from '$lib/version';

  let dialog: HTMLDialogElement;
  const updateInfo = $derived(swStore.updateInfo);

  function handleUpdate() {
    console.log('[UpdateNotification] User clicked update button');
    swStore.applyUpdate();
  }

  function handleDismiss() {
    console.log('[UpdateNotification] Dismissing update dialog');
    swStore.dismissUpdate();
    dialog?.close();
  }

  function openChangelog() {
    window.open(CHANGELOG_URL, '_blank', 'noopener,noreferrer');
  }

  $effect(() => {
    console.log('[UpdateNotification] Effect running:', {
      updateAvailable: swStore.updateAvailable,
      hasUpdateInfo: !!updateInfo,
      hasDialog: !!dialog
    });

    if (swStore.updateAvailable && updateInfo && dialog) {
      console.log('[UpdateNotification] Opening dialog for version:', updateInfo.version);
      dialog.showModal();
    }
  });
</script>

<dialog
  bind:this={dialog}
  onclose={handleDismiss}
  class="dialog update-dialog"
>
  <div class="update-dialog__body">
    <div class="update-dialog__header">
      <span class="material-symbols-outlined icon-3xl text-primary">system_update</span>
      <h2 class="update-dialog__title">
        Neue Version verfügbar
      </h2>
    </div>

    {#if updateInfo}
      <div class="update-dialog__version">
        <p class="update-dialog__version-label">
          Version {updateInfo.version}
        </p>
      </div>

      {#if updateInfo.notes}
        <div class="info-box update-dialog__notes">
          <p class="update-dialog__notes-summary">
            {updateInfo.notes.summary}
          </p>
          <ul class="update-dialog__highlights">
            {#each updateInfo.notes.highlights as highlight}
              <li class="update-dialog__highlight-item">
                <span class="text-primary">•</span>
                <span>{highlight}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}

    <div class="update-dialog__actions">
      <button
        onclick={handleUpdate}
        class="btn btn--primary w-full"
        type="button"
      >
        <span class="material-symbols-outlined">refresh</span>
        Jetzt aktualisieren
      </button>
      <div class="update-dialog__secondary-actions">
        <button onclick={openChangelog} class="btn btn--secondary update-dialog__secondary-btn">
          Mehr Infos
        </button>
        <button onclick={handleDismiss} class="btn btn--secondary update-dialog__secondary-btn">
          Später
        </button>
      </div>
    </div>
  </div>
</dialog>

<style>
  .update-dialog {
    max-width: 28rem;
  }

  .update-dialog__body {
    padding: var(--space-lg);
  }

  .update-dialog__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-block-end: var(--space-md);
  }

  .update-dialog__title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
  }

  .update-dialog__version {
    margin-block-end: var(--space-md);
  }

  .update-dialog__version-label {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-text-secondary);
  }

  .update-dialog__notes {
    margin-block-end: var(--space-lg);
  }

  .update-dialog__notes-summary {
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
  }

  .update-dialog__highlights {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .update-dialog__highlight-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .update-dialog__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .update-dialog__secondary-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .update-dialog__secondary-btn {
    flex: 1;
  }
</style>
