<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { disclaimerStorage } from '$lib/shared/storage';

  const isOnboarding = $derived(page.url.searchParams.get('onboarding') === 'true');

  function acceptDisclaimer() {
    disclaimerStorage.set(true);
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
    <div class="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
      {#if !isOnboarding}
        <button
          onclick={() => goto('/')}
          class="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Zurück"
          type="button"
        >
          <span class="material-symbols-outlined leading-none">arrow_back</span>
        </button>
      {/if}
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
        {isOnboarding ? 'Willkommen bei carb-me' : 'Rechtliches & Datenschutz'}
      </h1>
    </div>
  </header>

  <main class="mx-auto max-w-4xl space-y-6 px-4 py-8">
    {#if isOnboarding}
      <!-- Onboarding hint -->
      <div class="rounded-xl border-2 border-blue-500 bg-blue-50 p-4 dark:border-blue-400 dark:bg-blue-900/30">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
          <div>
            <p class="font-semibold text-blue-800 dark:text-blue-200">Bitte sorgfältig lesen</p>
            <p class="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Lies dir den folgenden Haftungsausschluss bitte aufmerksam durch. Am Ende kannst du mit einem Klick auf
              "Verstanden & Weiter" bestätigen, dass du alles gelesen und verstanden hast.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Haftungsausschluss -->
    <div class="card space-y-4 mb-1.5">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Haftungsausschluss</h2>

      <p class="text-sm text-gray-600 dark:text-gray-400">Stand: {new Date().toLocaleDateString('de-DE')}</p>

      <div class="space-y-4 text-sm">
        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">1. Keine medizinische Beratung</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Diese Anwendung (carb-me) dient ausschließlich zu Informationszwecken und stellt keine medizinische Beratung,
            Diagnose oder Behandlung dar. Die bereitgestellten Informationen zu Kohlenhydraten, Broteinheiten (BE) und
            Kohlenhydrateinheiten (KHE) ersetzen nicht die professionelle Beratung durch qualifiziertes medizinisches
            Fachpersonal.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">2. Eigenverantwortung</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Die Nutzung dieser App erfolgt auf eigene Verantwortung. Jeder Nutzer ist selbst dafür verantwortlich, die
            Richtigkeit der angezeigten Werte zu überprüfen und seine Therapie in Absprache mit seinem Arzt oder Diabetologen
            durchzuführen.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">3. Keine Garantie für Richtigkeit</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Trotz sorgfältiger Recherche können die in dieser App angezeigten Nährwertangaben Fehler enthalten oder von
            tatsächlichen Werten abweichen. Die Werte können je nach Herkunft, Reifegrad und Zubereitung der Lebensmittel
            variieren.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">4. Haftungsausschluss</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Der Entwickler dieser App übernimmt keinerlei Haftung für Schäden, die durch die Nutzung dieser Anwendung
            entstehen. Dies umfasst insbesondere gesundheitliche Folgen durch falsche Berechnungen oder fehlerhafte Daten.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">5. Diabetesmanagement</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Bei Diabetes ist eine individuelle Therapie erforderlich. Änderungen an Ihrer Behandlung sollten nur nach
            Rücksprache mit Ihrem behandelnden Arzt vorgenommen werden. Im Notfall wenden Sie sich bitte unverzüglich an
            einen Arzt oder den Notruf (112).
          </p>
        </section>
      </div>

      <div class="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/30">
        <p class="font-semibold text-yellow-800 dark:text-yellow-200">Wichtiger Hinweis:</p>
        <p class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
          Durch die Nutzung dieser App bestätigen Sie, dass Sie diesen Haftungsausschluss gelesen und verstanden haben und
          die App auf eigene Verantwortung verwenden.
        </p>
      </div>

      {#if isOnboarding}
        <button
          onclick={acceptDisclaimer}
          class="btn-touch mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          type="button"
        >
          <span class="material-symbols-outlined mr-2 inline-block align-middle leading-none">check_circle</span>
          Verstanden & Weiter
        </button>
      {/if}
    </div>

    <!-- Datenschutz -->
    <div class="card space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Datenschutz</h2>

      <div class="space-y-4 text-sm">
        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Privacy by Design</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Diese Anwendung wurde bewusst so entwickelt, dass <strong>keinerlei personenbezogene Daten</strong> erfasst,
            verarbeitet oder übermittelt werden.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Keine Datenübertragung</h3>
          <p class="text-gray-700 dark:text-gray-300">Alle Ihre Daten bleiben ausschließlich auf Ihrem Gerät:</p>
          <ul class="ml-5 list-disc space-y-1 text-gray-700 dark:text-gray-300">
            <li>Es werden keine Daten an Server übermittelt</li>
            <li>Es erfolgt keine Kommunikation mit externen Diensten</li>
            <li>Es werden keine Cookies gesetzt</li>
            <li>Es gibt keine Benutzerkonten oder Registrierung</li>
          </ul>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Lokale Datenspeicherung</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Die App nutzt ausschließlich den lokalen Browser-Speicher (localStorage) Ihres Geräts für:
          </p>
          <ul class="ml-5 list-disc space-y-1 text-gray-700 dark:text-gray-300">
            <li>Favoriten-Liste</li>
            <li>Selbst erstellte Lebensmittel</li>
            <li>Aktuelle Mahlzeiten</li>
            <li>App-Einstellungen</li>
          </ul>
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            Diese Daten bleiben <strong>ausschließlich auf Ihrem Gerät</strong> und können jederzeit in den Einstellungen
            gelöscht werden.
          </p>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Keine Tracking-Tools</h3>
          <p class="text-gray-700 dark:text-gray-300">Diese App verwendet:</p>
          <ul class="ml-5 list-disc space-y-1 text-gray-700 dark:text-gray-300">
            <li>Keine Analyse-Tools (z.B. Google Analytics)</li>
            <li>Keine Social Media Plugins</li>
            <li>Keine Werbenetzwerke</li>
            <li>Keine Tracking-Pixel</li>
          </ul>
        </section>

        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">GitHub Pages Hosting</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Die App wird auf GitHub Pages gehostet. GitHub kann beim Abruf technisch bedingte Zugriffsdaten (IP-Adresse,
            Browser-Typ) erfassen. Diese Daten werden nicht an den Entwickler weitergegeben.
          </p>
        </section>
      </div>

      <div class="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
        <p class="font-semibold text-green-800 dark:text-green-200">✓ Privacy First</p>
        <p class="mt-2 text-sm text-green-700 dark:text-green-300">
          Keine Datenübertragung • Keine Cookies • Kein Tracking • Alles bleibt auf Ihrem Gerät
        </p>
      </div>
    </div>

    <!-- Datenquellen -->
    <div class="card space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Datenquellen</h2>

      <div class="space-y-4 text-sm">
        <section>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Bundeslebensmittelschlüssel (BLS)</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Die Nährwertdaten in dieser App basieren auf dem Bundeslebensmittelschlüssel (BLS) Version 4.0,
            herausgegeben vom Max Rubner-Institut (MRI) im Auftrag des Bundesministeriums für Ernährung und
            Landwirtschaft (BMEL).
          </p>
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            Mehr Informationen: <a href="https://www.blsdb.de" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">www.blsdb.de</a>
          </p>
        </section>
      </div>

      <div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
        <p class="font-semibold text-blue-800 dark:text-blue-200">Offizielle Datenquelle</p>
        <p class="mt-2 text-sm text-blue-700 dark:text-blue-300">
          Der BLS ist die offizielle deutsche Nährwertdatenbank und wird regelmäßig vom Max Rubner-Institut aktualisiert.
        </p>
      </div>
    </div>
  </main>
</div>
