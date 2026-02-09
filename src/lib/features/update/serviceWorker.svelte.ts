import { APP_VERSION, DEFAULT_VERSION, getVersionNotes, type VersionNotes } from '$lib/version';
import { lastSeenVersionStorage } from '$lib/shared/storage';

interface UpdateInfo {
  version: string;
  notes: VersionNotes | null;
  available: boolean;
}

class ServiceWorkerStore {
  updateAvailable = $state(false);
  updateInfo = $state<UpdateInfo | null>(null);

  private updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;

  /**
   * Initialize service worker via VitePWA's registerSW.
   * Call this once from +layout.svelte onMount.
   */
  async init() {
    // Check for version-based update on page load (independent of SW events)
    this.checkVersionUpdate();

    // Dynamic import to avoid SSR build issues — virtual:pwa-register
    // depends on workbox-window which is only available client-side
    const { registerSW } = await import('virtual:pwa-register');

    this.updateSW = registerSW({
      immediate: true,
      onNeedRefresh: () => {
        console.log('[SW] New service worker waiting, update available');
        this.notifyUpdate(APP_VERSION);
      },
      onRegisteredSW: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => {
        console.log('[SW] Registered:', swUrl);

        if (registration) {
          // Periodic update check (every 60 minutes)
          setInterval(() => {
            console.log('[SW] Checking for updates...');
            registration.update();
          }, 60 * 60 * 1000);

          // Check for updates when page becomes visible
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              console.log('[SW] Page visible, checking for updates...');
              registration.update();
            }
          });
        }
      },
      onRegisterError: (error: unknown) => {
        console.log('[SW] Registration failed:', error);
      }
    });
  }

  private checkVersionUpdate() {
    this.notifyUpdate(APP_VERSION);
  }

  notifyUpdate(version: string) {
    const lastSeen = lastSeenVersionStorage.get();

    // Don't show if versions are the same or older
    if (this.compareVersions(lastSeen, version) >= 0) return;

    // First install — save version silently
    if (lastSeen === DEFAULT_VERSION) {
      console.log('[SW] First time seeing version, saving without notification');
      lastSeenVersionStorage.set(version);
      return;
    }

    console.log(`[SW] Update detected: ${lastSeen} -> ${version}`);
    this.updateAvailable = true;
    this.updateInfo = {
      version,
      notes: getVersionNotes(version),
      available: true
    };
  }

  /**
   * Activate the waiting service worker and reload the page.
   */
  async applyUpdate() {
    this.markVersionSeen();
    await this.updateSW?.();
    window.location.reload();
  }

  dismissUpdate() {
    this.updateAvailable = false;
    this.updateInfo = null;
  }

  markVersionSeen() {
    lastSeenVersionStorage.set(APP_VERSION);
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
