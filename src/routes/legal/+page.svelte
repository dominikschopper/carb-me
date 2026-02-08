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

<div class="legal">
  <header class="legal__header">
    <div class="legal__header-inner">
      {#if !isOnboarding}
        <button
          onclick={() => goto('/')}
          class="legal__back-btn"
          aria-label="Zurück"
          type="button"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      {/if}
      <h1 class="legal__page-title">
        {isOnboarding ? 'Willkommen bei carb-me' : 'Rechtliches & Datenschutz'}
      </h1>
    </div>
  </header>

  <main class="legal__main">
    {#if isOnboarding}
      <!-- Onboarding hint -->
      <div class="info-box legal__onboarding-hint">
        <div class="legal__hint-content">
          <span class="material-symbols-outlined text-primary">info</span>
          <div>
            <p class="legal__hint-title">Bitte sorgfältig lesen</p>
            <p class="legal__hint-text">
              Lies dir den folgenden Haftungsausschluss bitte aufmerksam durch. Am Ende kannst du mit einem Klick auf
              "Verstanden & Weiter" bestätigen, dass du alles gelesen und verstanden hast.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Haftungsausschluss -->
    <div class="card legal__section">
      <h2 class="legal__title">Haftungsausschluss</h2>

      <p class="legal__date">Stand: {new Date().toLocaleDateString('de-DE')}</p>

      <div class="legal__content">
        <section>
          <h3 class="legal__subtitle">1. Keine medizinische Beratung</h3>
          <p class="legal__text">
            Diese Anwendung (carb-me) dient ausschließlich zu Informationszwecken und stellt keine medizinische Beratung,
            Diagnose oder Behandlung dar. Die bereitgestellten Informationen zu Kohlenhydraten, Broteinheiten (BE) und
            Kohlenhydrateinheiten (KHE) ersetzen nicht die professionelle Beratung durch qualifiziertes medizinisches
            Fachpersonal.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">2. Eigenverantwortung</h3>
          <p class="legal__text">
            Die Nutzung dieser App erfolgt auf eigene Verantwortung. Jeder Nutzer ist selbst dafür verantwortlich, die
            Richtigkeit der angezeigten Werte zu überprüfen und seine Therapie in Absprache mit seinem Arzt oder Diabetologen
            durchzuführen.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">3. Keine Garantie für Richtigkeit</h3>
          <p class="legal__text">
            Trotz sorgfältiger Recherche können die in dieser App angezeigten Nährwertangaben Fehler enthalten oder von
            tatsächlichen Werten abweichen. Die Werte können je nach Herkunft, Reifegrad und Zubereitung der Lebensmittel
            variieren.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">4. Haftungsausschluss</h3>
          <p class="legal__text">
            Der Entwickler dieser App übernimmt keinerlei Haftung für Schäden, die durch die Nutzung dieser Anwendung
            entstehen. Dies umfasst insbesondere gesundheitliche Folgen durch falsche Berechnungen oder fehlerhafte Daten.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">5. Diabetesmanagement</h3>
          <p class="legal__text">
            Bei Diabetes ist eine individuelle Therapie erforderlich. Änderungen an Ihrer Behandlung sollten nur nach
            Rücksprache mit Ihrem behandelnden Arzt vorgenommen werden. Im Notfall wenden Sie sich bitte unverzüglich an
            einen Arzt oder den Notruf (112).
          </p>
        </section>
      </div>

      <div class="info-box info-box--warning">
        <p class="legal__notice-title">Wichtiger Hinweis:</p>
        <p class="legal__notice-text">
          Durch die Nutzung dieser App bestätigen Sie, dass Sie diesen Haftungsausschluss gelesen und verstanden haben und
          die App auf eigene Verantwortung verwenden.
        </p>
      </div>

      {#if isOnboarding}
        <button
          onclick={acceptDisclaimer}
          class="btn btn--primary legal__accept-btn"
          type="button"
        >
          <span class="material-symbols-outlined">check_circle</span>
          Verstanden & Weiter
        </button>
      {/if}
    </div>

    <!-- Datenschutz -->
    <div class="card legal__section">
      <h2 class="legal__title">Datenschutz</h2>

      <div class="legal__content">
        <section>
          <h3 class="legal__subtitle">Privacy by Design</h3>
          <p class="legal__text">
            Diese Anwendung wurde bewusst so entwickelt, dass <strong>keinerlei personenbezogene Daten</strong> erfasst,
            verarbeitet oder übermittelt werden.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">Keine Datenübertragung</h3>
          <p class="legal__text">Alle Ihre Daten bleiben ausschließlich auf Ihrem Gerät:</p>
          <ul class="legal__list">
            <li>Es werden keine Daten an Server übermittelt</li>
            <li>Es erfolgt keine Kommunikation mit externen Diensten</li>
            <li>Es werden keine Cookies gesetzt</li>
            <li>Es gibt keine Benutzerkonten oder Registrierung</li>
          </ul>
        </section>

        <section>
          <h3 class="legal__subtitle">Lokale Datenspeicherung</h3>
          <p class="legal__text">
            Die App nutzt ausschließlich den lokalen Browser-Speicher (localStorage) Ihres Geräts für:
          </p>
          <ul class="legal__list">
            <li>Favoriten-Liste</li>
            <li>Selbst erstellte Lebensmittel</li>
            <li>Aktuelle Mahlzeiten</li>
            <li>App-Einstellungen</li>
          </ul>
          <p class="legal__text legal__text--spaced">
            Diese Daten bleiben <strong>ausschließlich auf Ihrem Gerät</strong> und können jederzeit in den Einstellungen
            gelöscht werden.
          </p>
        </section>

        <section>
          <h3 class="legal__subtitle">Keine Tracking-Tools</h3>
          <p class="legal__text">Diese App verwendet:</p>
          <ul class="legal__list">
            <li>Keine Analyse-Tools (z.B. Google Analytics)</li>
            <li>Keine Social Media Plugins</li>
            <li>Keine Werbenetzwerke</li>
            <li>Keine Tracking-Pixel</li>
          </ul>
        </section>

        <section>
          <h3 class="legal__subtitle">GitHub Pages Hosting</h3>
          <p class="legal__text">
            Die App wird auf GitHub Pages gehostet. GitHub kann beim Abruf technisch bedingte Zugriffsdaten (IP-Adresse,
            Browser-Typ) erfassen. Diese Daten werden nicht an den Entwickler weitergegeben.
          </p>
        </section>
      </div>

      <div class="info-box info-box--success">
        <p class="legal__notice-title">✓ Privacy First</p>
        <p class="legal__notice-text">
          Keine Datenübertragung • Keine Cookies • Kein Tracking • Alles bleibt auf Ihrem Gerät
        </p>
      </div>
    </div>

    <!-- Datenquellen -->
    <div class="card legal__section">
      <h2 class="legal__title">Datenquellen</h2>

      <div class="legal__content">
        <section>
          <h3 class="legal__subtitle">Bundeslebensmittelschlüssel (BLS)</h3>
          <p class="legal__text">
            Die Nährwertdaten in dieser App basieren auf dem Bundeslebensmittelschlüssel (BLS) Version 4.0,
            herausgegeben vom Max Rubner-Institut (MRI) im Auftrag des Bundesministeriums für Ernährung und
            Landwirtschaft (BMEL).
          </p>
          <p class="legal__text legal__text--spaced">
            Mehr Informationen: <a href="https://www.blsdb.de" target="_blank" rel="noopener noreferrer" class="legal__link">www.blsdb.de</a>
          </p>
        </section>
      </div>

      <div class="info-box">
        <p class="legal__notice-title">Offizielle Datenquelle</p>
        <p class="legal__notice-text">
          Der BLS ist die offizielle deutsche Nährwertdatenbank und wird regelmäßig vom Max Rubner-Institut aktualisiert.
        </p>
      </div>
    </div>
  </main>
</div>

<style>
  .legal {
    min-height: 100vh;
    background-color: var(--color-bg);
  }

  .legal__header {
    position: sticky;
    top: 0;
    z-index: 40;
    border-block-end: 1px solid var(--color-border);
    background-color: color-mix(in srgb, var(--color-bg-elevated) 95%, transparent);
    backdrop-filter: blur(8px);
  }

  .legal__header-inner {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    max-width: var(--content-max-width);
    margin-inline: auto;
    padding: var(--space-md);
  }

  .legal__back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs);
    background: none;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    color: var(--color-text);
    transition: background-color var(--transition-fast);
  }

  .legal__back-btn:hover {
    background-color: var(--color-bg-inset);
  }

  .legal__page-title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-text);
  }

  .legal__main {
    max-width: var(--content-max-width);
    margin-inline: auto;
    padding: var(--space-xl) var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .legal__onboarding-hint {
    border: 2px solid var(--color-primary);
    background-color: var(--color-primary-soft);
  }

  .legal__hint-content {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .legal__hint-title {
    font-weight: var(--weight-semibold);
    color: var(--color-primary-text);
  }

  .legal__hint-text {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-primary-text);
  }

  .legal__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .legal__title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-text);
  }

  .legal__date {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .legal__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    font-size: var(--text-sm);
  }

  .legal__subtitle {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
  }

  .legal__text {
    color: var(--color-text-secondary);
  }

  .legal__text--spaced {
    margin-block-start: var(--space-xs);
  }

  .legal__list {
    margin-inline-start: 1.25rem;
    list-style-type: disc;
    display: flex;
    flex-direction: column;
    gap: var(--size-3xs);
    color: var(--color-text-secondary);
  }

  .legal__link {
    color: var(--color-primary-text);
    text-decoration: none;
  }

  .legal__link:hover {
    text-decoration: underline;
  }

  .legal__notice-title {
    font-weight: var(--weight-semibold);
  }

  .legal__notice-text {
    margin-block-start: var(--space-xs);
    font-size: var(--text-sm);
  }

  .legal__accept-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
  }
</style>
