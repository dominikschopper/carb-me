// Version injected at build time by Vite
declare const __APP_VERSION__: string;

export const APP_VERSION = __APP_VERSION__;
export const CHANGELOG_URL = 'https://github.com/dominikschopper/carb-me/blob/master/CHANGELOG.md';
export const DEFAULT_VERSION = '1.0.0';

export interface VersionNotes {
  summary: string;
  highlights: string[];
}

export const VERSION_NOTES: Record<string, VersionNotes> = {
  '1.12.1': {
    summary: 'Offline-Modus & Bugfixes',
    highlights: [
      'App funktioniert jetzt vollständig offline',
      'Autocomplete in Eingabefeldern deaktiviert'
    ]
  },
  '1.12.0': {
    summary: 'Bugfixes & Refactoring',
    highlights: [
      'Service Worker Update-Prüfung funktioniert jetzt im Dev-Modus',
      'Besserer Kontrast und Layout',
      'Code-Verbesserungen aus dem Code-Review'
    ]
  },
  '1.11.0': {
    summary: 'PWA Update-Benachrichtigungen',
    highlights: [
      'Automatische Benachrichtigung bei App-Updates',
      'Verbesserte Offline-Funktionalität'
    ]
  }
};

export function getVersionNotes(version: string): VersionNotes | null {
  return VERSION_NOTES[version] || null;
}
