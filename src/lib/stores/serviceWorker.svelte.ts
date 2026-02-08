import { APP_VERSION, DEFAULT_VERSION, getVersionNotes, type VersionNotes } from '$lib/version';
import { lastSeenVersionStorage } from '$lib/utils/storage';

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // 60 minutes

interface UpdateInfo {
  version: string;
  notes: VersionNotes | null;
  available: boolean;
}

class ServiceWorkerStore {
  registration = $state<ServiceWorkerRegistration | null>(null);
  updateAvailable = $state(false);
  updateInfo = $state<UpdateInfo | null>(null);

  /**
   * Initialize service worker registration and update detection.
   * Call this once from +layout.svelte onMount.
   * @param basePath - The base path from SvelteKit (e.g., '' or '/subdir')
   */
  init(basePath: string) {
    // Check for version mismatch on page load (independent of SW events)
    this.checkForUpdate(APP_VERSION);

    if (!('serviceWorker' in navigator)) return;

    // Register the built service worker (built from src/service-worker.js by VitePWA)
    navigator.serviceWorker.register(`${basePath}/sw.js`).then(
      (registration) => {
        console.log('[SW] Registered:', registration.scope);
        this.registration = registration;

        // Check if there's a waiting service worker already
        if (registration.waiting) {
          console.log('[SW] Update found on registration');
          this.notifyUpdate(APP_VERSION);
        }

        // Listen for new service worker installing
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[SW] New service worker installing');

          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New service worker installed and waiting');
              this.notifyUpdate(APP_VERSION);
            }
          });
        });

        // Periodic update check
        setInterval(() => {
          console.log('[SW] Checking for updates...');
          registration.update();
        }, UPDATE_CHECK_INTERVAL_MS);

        // Check for updates when page becomes visible
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            console.log('[SW] Page visible, checking for updates...');
            registration.update();
          }
        });
      },
      (error) => {
        console.log('[SW] Registration failed:', error);
      }
    );

    // Listener for controller change (SW was activated after user action)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] New service worker activated');
    });
  }

  private checkForUpdate(version: string) {
    console.log('[SW Store] Checking for version update on page load');
    this.notifyUpdate(version);
  }

  notifyUpdate(version: string) {
    const lastSeen = lastSeenVersionStorage.get();

    // Don't show update notification if versions are the same or older
    if (this.compareVersions(lastSeen, version) >= 0) return;

    // Check if this is a first install/load scenario
    // If lastSeen is the default '1.0.0' and we're just loading the current version,
    // save it but don't show notification
    if (lastSeen === DEFAULT_VERSION) {
      console.log('[SW] First time seeing version, saving without notification');
      lastSeenVersionStorage.set(version);
      return;
    }

    // At this point, we have a genuine update from an older version to a newer one
    console.log(`[SW] Update detected: ${lastSeen} -> ${version}`);
    this.updateAvailable = true;
    this.updateInfo = {
      version,
      notes: getVersionNotes(version),
      available: true
    };
  }

  dismissUpdate() {
    console.log('[SW Store] dismissUpdate called, snoozing notification');
    this.updateAvailable = false;
    this.updateInfo = null;
    // Don't save the version - the periodic update check (every 60 min)
    // will re-trigger the notification
  }

  markVersionSeen() {
    console.log('[SW Store] markVersionSeen called, saving version:', APP_VERSION);
    lastSeenVersionStorage.set(APP_VERSION);
    console.log('[SW Store] Version saved, new lastSeen:', lastSeenVersionStorage.get());
  }

  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const diff = (parts1[i] || 0) - (parts2[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }
}

export const swStore = new ServiceWorkerStore();
