# Changelog

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
