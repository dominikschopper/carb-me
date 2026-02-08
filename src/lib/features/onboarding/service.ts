import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { onboardingStorage } from '$lib/shared/storage';

export interface OnboardingOptions {
  onComplete?: () => void;
  onSkip?: () => void;
  onNavigateToCustom?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToMeal?: () => void;
  onSearchDemo?: (query: string) => void;
  addToMeal?: () => void;
  deleteFromMeal?: () => void;
}

class OnboardingService {
  private driverInstance: Driver | null = null;

  startTour(options: OnboardingOptions = {}): void {
    if (typeof window === 'undefined') return;

    const state = onboardingStorage.get();
    if (state.completed || state.skipped) return;

    this.driverInstance = driver({
      showProgress: true,
      nextBtnText: 'Weiter',
      prevBtnText: 'Zurück',
      doneBtnText: 'Fertig',
      progressText: '{{current}} von {{total}}',

      onDestroyed: () => {
        const currentStep = this.driverInstance?.getActiveIndex();
        const totalSteps = this.driverInstance?.getConfig()?.steps?.length || 0;

        if (currentStep !== undefined && currentStep < totalSteps - 1) {
          onboardingStorage.set({ completed: false, skipped: true, lastShown: Date.now() });
          options.onSkip?.();
        }
      },

      steps: [

        {
          element: '[data-onboarding="start"]',
          popover: {
            title: 'Carb Me - App',
            description:
              'Wir starten eine Tour, um Dir alle wichtigen Funktionen der App kurz zu zeigen! Du kannst die Tour jederzeit abbrechen und in den Einstellungen neu starten.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '[data-onboarding="search-bar"]',
          popover: {
            title: 'Lebensmittel suchen',
            description:
              'Hier gibst Du einen Suchbegriff ein, um ein Lebensmittel zu finden. Wir suchen jetzt für Dich nach "Apfel".',
            side: 'bottom',
            align: 'center'
          },
          onHighlighted: () => {
            // Trigger demo search to show food cards for next step
            options.onSearchDemo?.('Apfel');
          }
        },
        {
          element: '[data-onboarding="calculator-open"]',
          popover: {
            title: 'Berechnung öffnen',
            description:
              'Wenn Du auf ein Lebensmittel klickst, öffnet sich der Rechner, in dem Du die Menge eingeben kannst.',
            side: 'left',
            align: 'center'
          }
        },
        {
          element: '[data-onboarding="favorite-star"]',
          popover: {
            title: 'Favoriten markieren',
            description:
              'Klicke auf den Stern, um häufig verwendete Lebensmittel als Favoriten zu speichern.',
            side: 'left',
            align: 'center'
          }
        },
        {
          element: '[data-onboarding="tab-search"]',
          popover: {
            title: 'Favoriten-Ansicht',
            description: 'Im leeren Suche-Tab findest du Deine markierten Favoriten immer schnell wieder.',
            side: 'top',
            align: 'center'
          },
          onHighlighted: () => {
            // Clear search to show favorites
            options.onSearchDemo?.('');
          }
        },
        {
          element: '[data-onboarding="tab-meal"]',
          popover: {
            title: 'Mahlzeiten zusammenstellen',
            description:
              'Im Rechner kannst du Lebensmittel auch zu einer Mahlzeit hinzufügen. Die gesamte Mahlzeit kannst Du hier sehen.',
            side: 'top',
            align: 'end',
            onNextClick: () => {
              options.onNavigateToMeal?.();
              // Wait for Svelte to render the component before moving to next step
              setTimeout(() => {
                this.driverInstance?.moveNext();

              }, 300);
            }
          }
        },
        {
          element: '[data-onboarding="meal-list"]',
          popover: {
            title: 'Deine Mahlzeit',
            description:
              'Hier erscheinen alle Lebensmittel, die Du zu einer Mahlzeit hinzugefügt hast. Du siehst immer auch die Gesamtmenge  an gKH für die gesamte Mahlzeit.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-onboarding="meal-list-header"]',
          popover: {
            title: 'Deine Mahlzeit',
            description:
              'Im Kopfbereich siehst Du hier oben auch immer die Gesamtmenge Deiner Mahlzeit auf einen Blick.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '[data-onboarding="tab-custom"]',
          popover: {
            title: 'Eigene Lebensmittel',
            description:
              'Hier kannst du eigene Lebensmittel mit individuellen Nährwerten hinzufügen. Lass uns das ansehen.',
            side: 'top',
            align: 'start',
            onNextClick: () => {
              options.onNavigateToCustom?.();
              // Wait for Svelte to render the component before moving to next step
              setTimeout(() => {
                this.driverInstance?.moveNext();
              }, 300);
            }
          }
        },
        {
          element: '[data-onboarding="add-custom-food"]',
          popover: {
            title: 'Lebensmittel hinzufügen',
            description:
              'Klicke hier, um ein neues Lebensmittel mit deinen eigenen Nährwerten zu erstellen. Du kannst es später jederzeit bearbeiten oder löschen.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-onboarding="tab-settings"]',
          popover: {
            title: 'Einstellungen',
            description:
              'Passe die App deinen Bedürfnissen an. Lass uns einen Blick in die Einstellungen werfen.',
            side: 'top',
            align: 'center',
            onNextClick: () => {
              options.onNavigateToSettings?.();
              // Wait for Svelte to render the component before moving to next step
              setTimeout(() => {
                this.driverInstance?.moveNext();
              }, 100);
            }
          }
        },
        {
          element: '[data-onboarding="settings-unit"]',
          popover: {
            title: 'Bevorzugte Einheit',
            description: 'Wähle, ob du BE (Broteinheiten) oder KHE (Kohlenhydrateinheiten) bevorzugst.',
            side: 'top',
            align: 'center',
          },
          onHighlighted: () => {
            document.querySelector('[data-onboarding="settings-unit"]')?.scrollIntoView();
            window.scrollBy(0, 20);
          }
        },
        {
          element: '[data-onboarding="settings-energy"]',
          popover: {
            title: 'Brennwert-Anzeige',
            description: 'Aktiviere hier optional die Anzeige von Kalorien (kcal/kJ).',
            side: 'top',
            align: 'center'
          },
          onHighlighted: () => {
            document.querySelector('[data-onboarding="settings-energy"]')?.scrollIntoView();
            window.scrollBy(0, 20);
          }
        },
        {
          element: '[data-onboarding="settings-categories"]',
          popover: {
            title: 'Suchergebnisse filtern',
            description:
              'Hier kannst du bestimmte Lebensmittelkategorien (wie Fertiggerichte oder alkoholische Getränke) aus den Suchergebnissen ausblenden.',
            side: 'top',
            align: 'center',
          },
          onHighlighted: () => {
            document.querySelector('[data-onboarding="settings-categories"]')?.scrollIntoView();
            window.scrollBy(0, 50);
          }
        },
        {
          element: 'document',
          popover: {
            title: 'Fertig',
            description:
              'Die Tour ist beendet und ich hoffe, diese kleine App hilft Dir weiter,',
            onNextClick: () => {
              onboardingStorage.set({ completed: true, skipped: false, lastShown: Date.now() });
              options.onComplete?.();
              this.driverInstance?.destroy();
            }
          },
        }
      ]
    });

    this.driverInstance.drive();
  }

  shouldShow(): boolean {
    if (typeof window === 'undefined') return false;
    const state = onboardingStorage.get();
    return !state.completed && !state.skipped;
  }

  reset(): void {
    onboardingStorage.set({ completed: false, skipped: false });
  }

  destroy(): void {
    this.driverInstance?.destroy();
    this.driverInstance = null;
  }
}

export const onboardingService = new OnboardingService();
