import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage, STORAGE_KEYS, DEFAULT_SETTINGS } from './storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('returns default value when key does not exist', () => {
      const storage = new Storage<string>('test_key', 'default');
      expect(storage.get()).toBe('default');
    });

    it('returns stored value when key exists', () => {
      localStorageMock.setItem('test_key', JSON.stringify('stored_value'));
      const storage = new Storage<string>('test_key', 'default');
      expect(storage.get()).toBe('stored_value');
    });

    it('returns parsed object', () => {
      const obj = { foo: 'bar', count: 42 };
      localStorageMock.setItem('test_key', JSON.stringify(obj));
      const storage = new Storage<typeof obj>('test_key', { foo: '', count: 0 });
      expect(storage.get()).toEqual(obj);
    });

    it('returns parsed array', () => {
      const arr = [1, 2, 3];
      localStorageMock.setItem('test_key', JSON.stringify(arr));
      const storage = new Storage<number[]>('test_key', []);
      expect(storage.get()).toEqual(arr);
    });

    it('merges with defaults for objects (handles new properties)', () => {
      // Simulate stored settings missing a new property
      const storedSettings = {
        preferredUnit: 'KHE',
        showCategories: false,
      };
      localStorageMock.setItem('test_key', JSON.stringify(storedSettings));

      const defaultSettings = {
        preferredUnit: 'BE',
        showCategories: true,
        showTags: true, // New property not in stored
        newFeature: 'enabled', // Another new property
      };

      const storage = new Storage<typeof defaultSettings>('test_key', defaultSettings);
      const result = storage.get();

      // Should have stored values
      expect(result.preferredUnit).toBe('KHE');
      expect(result.showCategories).toBe(false);

      // Should have new default values
      expect(result.showTags).toBe(true);
      expect(result.newFeature).toBe('enabled');
    });

    it('does not merge arrays (replaces entirely)', () => {
      localStorageMock.setItem('test_key', JSON.stringify([1, 2]));
      const storage = new Storage<number[]>('test_key', [10, 20, 30]);
      expect(storage.get()).toEqual([1, 2]);
    });

    it('returns default on JSON parse error', () => {
      localStorageMock.setItem('test_key', 'invalid json {{{');
      const storage = new Storage<string>('test_key', 'default');
      expect(storage.get()).toBe('default');
    });
  });

  describe('set', () => {
    it('stores value as JSON', () => {
      const storage = new Storage<string>('test_key', 'default');
      storage.set('new_value');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', '"new_value"');
    });

    it('stores object as JSON', () => {
      const storage = new Storage<{ name: string }>('test_key', { name: '' });
      storage.set({ name: 'test' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', '{"name":"test"}');
    });

    it('stores array as JSON', () => {
      const storage = new Storage<number[]>('test_key', []);
      storage.set([1, 2, 3]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', '[1,2,3]');
    });
  });

  describe('clear', () => {
    it('removes the key from localStorage', () => {
      const storage = new Storage<string>('test_key', 'default');
      storage.set('value');
      storage.clear();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_key');
    });
  });
});

describe('STORAGE_KEYS', () => {
  it('has all expected keys', () => {
    expect(STORAGE_KEYS.CUSTOM_FOODS).toBe('carbme_custom_foods');
    expect(STORAGE_KEYS.FAVORITES).toBe('carbme_favorites');
    expect(STORAGE_KEYS.CURRENT_MEAL).toBe('carbme_current_meal');
    expect(STORAGE_KEYS.HISTORY).toBe('carbme_history');
    expect(STORAGE_KEYS.THEME).toBe('carbme_theme');
    expect(STORAGE_KEYS.SETTINGS).toBe('carbme_settings');
    expect(STORAGE_KEYS.DISCLAIMER_ACCEPTED).toBe('carbme_disclaimer_accepted');
  });
});

describe('DEFAULT_SETTINGS', () => {
  it('has correct default values', () => {
    expect(DEFAULT_SETTINGS.preferredUnit).toBe('BE');
    expect(DEFAULT_SETTINGS.showCategories).toBe(true);
    expect(DEFAULT_SETTINGS.showTags).toBe(true);
    expect(DEFAULT_SETTINGS.itemsPerPage).toBe(20);
    expect(DEFAULT_SETTINGS.showEnergy).toBe(false);
    expect(DEFAULT_SETTINGS.energyUnit).toBe('kcal');
    expect(DEFAULT_SETTINGS.hidePreparedMeals).toBe(false);
  });
});
