# Changelog

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
