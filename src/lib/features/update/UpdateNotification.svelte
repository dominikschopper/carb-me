<script lang="ts">
  import { swStore } from './serviceWorker.svelte';
  import { CHANGELOG_URL } from '$lib/version';

  let dialog: HTMLDialogElement;
  const updateInfo = $derived(swStore.updateInfo);

  function handleUpdate() {
    console.log('[UpdateNotification] User clicked update button');
    swStore.markVersionSeen();

    // Tell the waiting service worker to activate
    if (swStore.registration?.waiting) {
      console.log('[UpdateNotification] Sending SKIP_WAITING to service worker');
      swStore.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Reload the page to use the new service worker
    window.location.reload();
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
  class="w-full max-w-md rounded-2xl bg-white p-0 backdrop:bg-black/50 dark:bg-gray-800"
>
  <div class="p-6">
    <div class="mb-4 flex items-center gap-3">
      <span class="material-symbols-outlined text-3xl text-blue-500">system_update</span>
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
        Neue Version verfügbar
      </h2>
    </div>

    {#if updateInfo}
      <div class="mb-4">
        <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Version {updateInfo.version}
        </p>
      </div>

      {#if updateInfo.notes}
        <div class="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
          <p class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {updateInfo.notes.summary}
          </p>
          <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {#each updateInfo.notes.highlights as highlight}
              <li class="flex items-start gap-2">
                <span class="text-blue-500">•</span>
                <span>{highlight}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}

    <div class="flex flex-col gap-3">
      <button
        onclick={handleUpdate}
        class="btn-touch w-full bg-blue-600 text-white hover:bg-blue-700"
        type="button"
      >
        <span class="material-symbols-outlined mr-2">refresh</span>
        Jetzt aktualisieren
      </button>
      <div class="flex gap-3">
        <button onclick={openChangelog} class="btn-touch flex-1 border-2 border-gray-300 bg-gray-200 dark:bg-gray-500">
          Mehr Infos
        </button>
        <button onclick={handleDismiss} class="btn-touch flex-1 border-2 border-gray-300 bg-gray-200 dark:bg-gray-500">
          Später
        </button>
      </div>
    </div>
  </div>
</dialog>
