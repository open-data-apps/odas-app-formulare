# Changelog

## 1.6.0 - 2026-07-31
- FIX: escapeHtml() von der DOM- auf die Regex-Variante umgestellt (F-08); die alte Fassung maskierte " und ' nicht
- FIX: Maskierung auf alle Daten- und Attributkontexte ausgedehnt (F-08)
- CHG: toter Konfigurationsschlüssel lizenz entfernt (F-17)
- CHG: nie gelesener Schlüssel feedback-email entfernt (F-17)
- CHG: brandingCSS und brandingCSSFile als Base-Abhängigkeiten deklariert und lokal gespiegelt (F-17)
- CHG: format.typ von "String" auf v1-sicheres "string" korrigiert (F-18)
- CHG: dropdown-Default auf Feldebene verschoben statt in format (F-18)
- CHG: Platzhalter-Entwickler mueller-gmbh durch ondics-gmbh ersetzt (F-21)
- CHG: Platzhalter Mueller GmbH aus der Fußzeile entfernt (F-21)
- FIX: defekte Icon- und Screenshot-Referenzen korrigiert (F-19)
- CHG: daten.schema auf assets/schema.json gesetzt (F-20)
- CHG: assets/schema.json auf ein flaches Frictionless Table Schema gebracht (F-20)

## 1.5.0 - 2026-07-30

- **FIX:** Laufzeitfehler nach dem Laden der Konfiguration werden jetzt sichtbar gemeldet; `handleRouting()` wird `await`et und besitzt einen Fehlerpfad. Bisher blieb die Seite bei einem Fehler im Seitenaufbau stumm leer
- **FIX:** `getConfigUrl()` schneidet bei einer URL ohne abschliessenden Schraegstrich nicht mehr das letzte Verzeichnis ab; die Konfiguration wird auch unter `.../app` gefunden
- **FIX:** Klick auf einen Hash-Link, der bereits die aktive Seite bezeichnet, rendert die Seite neu (`setupSamePageLinks()`) - das Logo fuehrt damit aus Unteransichten zurueck zur Startseite
- **ENH:** `app/app-base.js` ist wieder byte-identisch zum Template `oda-generic` 1.4.0; app-spezifisches Aufraeumen laeuft ueber den neuen Hook `onPageLeave(page)` in `app/app.js`
- **ENH:** Der app-lokale Workaround fuer den Startseiten-Klick entfaellt; die Base-Runtime deckt diesen Fall jetzt selbst ab

## 1.4.1 - 2026-07-28

- **FIX:** Mail-Endpunkt wird aus dem App-Basispfad (`getOdasAppBasePath()`) gebildet statt aus `window.location.href`; der Hash der Base-Runtime landete bisher in der URL, sodass der POST auf der eigenen `index.html` statt auf `…/mail` ankam
- **FIX:** Absenden prüft jetzt den HTTP-Status; die Bestätigungsseite erscheint nur bei erfolgreicher Übermittlung. Bei Fehlern erscheint eine sichtbare Meldung, das Formular samt Eingaben bleibt erhalten und der Absende-Button ist während des Requests gesperrt
- **FIX:** Klick auf das Logo führt aus der Formularansicht zurück zur Formularauswahl. Der Hash steht dort bereits auf `#startseite`, sodass kein `hashchange` ausgelöst wurde und die Base-Runtime nicht neu gerendert hat
- **ENH:** Box „Weitere Informationen" ist wie die Methodik-Box ein- und ausklappbar; beide teilen sich jetzt dieselben CSS-Regeln

## 1.4.0 - 2026-07-24

- **FIX:** Laufzeit-Fehlermeldung wird vor der Anzeige HTML-maskiert (`escapeHtmlForBase`); ein Fehlertext kann kein Markup mehr in die Seite einschleusen (XSS)
- **FIX:** Startseiten-Renderer wird nun `await`et; bei asynchronen Apps erscheint kein kurzzeitiges `[object Promise]` in `#main-content`

## 1.3.0 - 2026-07-23

- **ENH:** Datenabruf auf den Schalter `proxyAktiv` umgestellt; direkte Abrufe sind der Standard, der ODAS-Proxy wird nur noch bei `ja` verwendet
- **ENH:** Einfachen Standalone-Betrieb hinter Traefik mit derselben `odas-config/config.json` wie in der Entwicklung ergänzt
- **ENH:** Traefik-Anbindung auf das externe Netzwerk `proxynet`, den EntryPoint `websecure` und den Zertifikatsresolver `letsencrypt` festgelegt
- **FIX:** Proxy-Basispfad funktioniert jetzt auch bei URLs mit `index.html`; der Ziel-Pfad wird URL-kodiert
- **DOC:** Start über `STANDALONE=true make up` dokumentiert

## v1.2.0 — 2026-07-03

- ENH: escapeHtml(), Methodik-Box (TODO 2) und Weitere-Infos-Box (TODO 4) hinzugefügt (Schale 4, Prefix `fo-`)
- FIX: Doppelten `urldaten`-Schlüssel aus `instanz-config` entfernt (nur `urlDaten` behalten)
- ENH: Für-wen-Abschnitt in `beschreibung` ergänzt

## 20.02.2025

- ENH: Neue App Struktur

## 27.02.2025

- ENH: Verbesserungen bei der neuen App Struktur
