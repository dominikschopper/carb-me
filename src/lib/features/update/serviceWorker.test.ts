import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before imports
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

vi.stubGlobal('localStorage', localStorageMock);

import { swStore } from './serviceWorker.svelte';
import { lastSeenVersionStorage } from '$lib/shared/storage';
import { APP_VERSION } from '$lib/version';

describe('ServiceWorkerStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    swStore.updateAvailable = false;
    swStore.updateInfo = null;
    swStore.registration = null;

    // Clear localStorage
    localStorageMock.clear();
  });

  describe('Version Comparison', () => {
    it('should detect newer major version', () => {
      lastSeenVersionStorage.set('1.10.0');
      swStore.notifyUpdate('2.0.0');

      expect(swStore.updateAvailable).toBe(true);
      expect(swStore.updateInfo?.version).toBe('2.0.0');
    });

    it('should detect newer minor version', () => {
      lastSeenVersionStorage.set('1.10.0');
      swStore.notifyUpdate('1.11.0');

      expect(swStore.updateAvailable).toBe(true);
      expect(swStore.updateInfo?.version).toBe('1.11.0');
    });

    it('should detect newer patch version', () => {
      lastSeenVersionStorage.set('1.10.0');
      swStore.notifyUpdate('1.10.1');

      expect(swStore.updateAvailable).toBe(true);
      expect(swStore.updateInfo?.version).toBe('1.10.1');
    });

    it('should not notify for same version', () => {
      lastSeenVersionStorage.set('1.11.0');
      swStore.notifyUpdate('1.11.0');

      expect(swStore.updateAvailable).toBe(false);
      expect(swStore.updateInfo).toBe(null);
    });

    it('should not notify for older version', () => {
      lastSeenVersionStorage.set('1.11.0');
      swStore.notifyUpdate('1.10.0');

      expect(swStore.updateAvailable).toBe(false);
      expect(swStore.updateInfo).toBe(null);
    });

    it('should handle first-time users (default version 1.0.0) - no notification', () => {
      // Don't set any version, should use default '1.0.0'
      // First-time users should NOT see an update notification,
      // the version is silently saved instead
      swStore.notifyUpdate('1.11.0');

      expect(swStore.updateAvailable).toBe(false);
      expect(swStore.updateInfo).toBe(null);
      // Version should be saved silently
      expect(lastSeenVersionStorage.get()).toBe('1.11.0');
    });
  });

  describe('Update Info', () => {
    it('should include version notes when available', () => {
      lastSeenVersionStorage.set('1.10.0');
      swStore.notifyUpdate('1.11.0');

      expect(swStore.updateInfo?.notes).not.toBe(null);
      expect(swStore.updateInfo?.notes?.summary).toBe('PWA Update-Benachrichtigungen');
      expect(swStore.updateInfo?.notes?.highlights).toHaveLength(2);
    });

    it('should handle missing version notes gracefully', () => {
      lastSeenVersionStorage.set('1.10.0');
      swStore.notifyUpdate('1.99.0'); // Version without notes

      expect(swStore.updateInfo?.notes).toBe(null);
      expect(swStore.updateInfo?.version).toBe('1.99.0');
      expect(swStore.updateInfo?.available).toBe(true);
    });
  });

  describe('Dismiss Update', () => {
    it('should clear update state but NOT save version (snooze behavior)', () => {
      lastSeenVersionStorage.set('1.9.0');
      const nextVersion = '1.10.0';
      swStore.notifyUpdate(nextVersion);

      expect(swStore.updateAvailable).toBe(true);

      swStore.dismissUpdate();

      expect(swStore.updateAvailable).toBe(false);
      expect(swStore.updateInfo).toBe(null);
      // Version should NOT be saved - periodic check will re-trigger notification
      const savedVersion = lastSeenVersionStorage.get();
      expect(savedVersion).toBe('1.9.0'); // Still the old version
    });

    it('should allow re-notification after dismiss (snooze)', () => {
      lastSeenVersionStorage.set('1.9.0');
      const nextVersion = '1.10.0';

      swStore.notifyUpdate(nextVersion);
      expect(swStore.updateAvailable).toBe(true);

      swStore.dismissUpdate();
      expect(swStore.updateAvailable).toBe(false);

      // Simulate periodic check - should show again since version wasn't saved
      swStore.notifyUpdate(nextVersion);
      expect(swStore.updateAvailable).toBe(true);
    });
  });

  describe('Mark Version Seen', () => {
    it('should save current version to storage', () => {
      swStore.markVersionSeen();

      const savedVersion = lastSeenVersionStorage.get();
      expect(savedVersion).toBe(APP_VERSION);
    });
  });

  describe('Service Worker Registration', () => {
    it('should have registration property', () => {
      // Registration is set internally by init(), just verify the property exists
      expect(swStore.registration).toBe(null); // Default state
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed version strings gracefully', () => {
      lastSeenVersionStorage.set('invalid');

      // Should not throw, just compare as best as possible
      expect(() => {
        swStore.notifyUpdate('1.11.0');
      }).not.toThrow();
    });

    it('should handle version with missing parts', () => {
      lastSeenVersionStorage.set('1.10');
      swStore.notifyUpdate('1.11.0');

      expect(swStore.updateAvailable).toBe(true);
    });

    it('should not show update after markVersionSeen', () => {
      lastSeenVersionStorage.set('1.9.0');
      const nextVersion = '1.10.0';

      swStore.notifyUpdate(nextVersion);
      expect(swStore.updateAvailable).toBe(true);

      // User clicks "Update Now" which calls markVersionSeen
      swStore.markVersionSeen();
      swStore.updateAvailable = false;
      swStore.updateInfo = null;

      // Try to notify again - should not show because version was saved
      swStore.notifyUpdate(nextVersion);
      expect(swStore.updateAvailable).toBe(false);
    });
  });
});
