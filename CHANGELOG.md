# Changelog

## 1.30.0 - 2026-08-22
- **CHG:** `version` in `app-package.json` zu `app-version` umbenannt.
- **ENH:** Top-Level-Feld `app-package-version` ergänzt (Wert `"2"`: mehrere benannte API-URLs über `instanz-config.apiurls`).

## 1.29.0 - 2026-08-21
- **CHG:** Skalares `apiurl` durch das Array-Feld `apiurls` ersetzt (`typ: "array"`, Eintrag `formular`). Neuer Standard portfolioweit; `apiurl` entfällt. `app.js` liest die Datenquelle jetzt über `getOdasApiUrl(configdata, "formular")`.

## 1.28.0 - 2026-08-20
- Markdown-Metadaten: Paketbeschreibungen auf echtes Markdown umgestellt, exakte Identität Top-Level/Instanz hergestellt, lokale HTML-Fixture semantisch gespiegelt.

## 1.27.0 - 2026-08-20
- FIX: Drei-Datenzustände-Kontrakt umgesetzt — fehlende `apiurl` und leere Formularliste zeigen jetzt `alert-info` statt einer generischen Fehlermeldung; Ladefehler (`state.loadError`) zeigen weiterhin `alert-danger` mit der eigentlichen Fehlermeldung (F-69)

## 1.26.0 - 2026-08-20
- FIX: `field.id` enthielt keine Instanzkennung (`foUid`) — bei zwei gleichzeitig gemounteten Instanzen mit identischer Formularquelle konnte ein Label-Klick den Fokus in der falschen Instanz auslösen (F-71, Hoch-Teilfall)

## 1.25.0 - 2026-08-17
- Korrektur an Welle X: `urlDaten` war dort fälschlich geleert und optional markiert; `apiurl.beispiel` referenziert tatsächlich einen echten CKAN-Datensatz (`.../dataset/formulare`, live verifiziert) — jetzt wie die anderen Apps mit `{{appconfig.datensatz-url}}`-Platzhalter und wieder als Pflichtfeld; lokale `odas-config/config.json` entsprechend befüllt (F-68)

## 1.24.0 - 2026-08-17
- `fetchOdasJson()` wirft jetzt bei nicht-JSON-Antworten (CSV, HTML, leerer Body) eine sprechende Konfigurationsfehlermeldung statt der rohen `JSON.parse`-Parserfehlermeldung (F-66)
- `urlDaten` zeigte auf den nicht mehr existierenden Host `offenedaten.esslingen.de` (NXDOMAIN); da `apiurl` auf eine mitgelieferte lokale Vorlage verweist und kein externer Datensatz existiert, ist das Feld jetzt geleert und in `app-package.json` als optional (`erforderlich: "nein"`) markiert statt einen falschen Link zu zeigen (F-67)

## 1.23.0 - 2026-08-17
- **CHG:** `instanz-config`-`category`-Vokabular auf Deutsch umgestellt (`allgemein`, `beschreibung`, `datenherkunft`, `kontakt-rechtliches`, `sonstiges`); die entfallenen Kategorien `metrics` und `advanced` wurden auf `beschreibung` bzw. `sonstiges` verteilt

## 1.22.0 - 2026-08-12
- FIX: `app/index.html` auf den Template-Stand (F-47): Datei byte-gleich aus `oda-generic` übernommen — gültiges HTML, deutsche ARIA-Labels, Footer im Body; Titel und Fußzeile bleiben Platzhalter und werden zur Laufzeit aus der Instanz-Config überschrieben

## 1.21.0 - 2026-08-12
- FIX: Formular-Pflichten werden jetzt tatsächlich durchgesetzt (F-48): Einwilligungserklärung, E-Mail bei angekreuzter Kopie-Option und `multiselect`-Pflichtfelder werden in `validatePage` geprüft (der nativen Constraint-Validation ging der `preventDefault()`-Absende-Handler zuvor in die Quere)
- FIX: Feldtyp `zahl` wird als `type="text"` mit `inputmode="numeric"` gerendert statt des ungültigen `type="zahl"`; die Ziffernprüfung übernimmt `validatePage` (F-53)

## 1.20.0 - 2026-08-11
- FIX: Warnung bei unbekanntem Feldtyp liest das normalisierte `field.type` statt des veralteten `field.typ` und zeigt den unbekannten Typ HTML-escaped an (default-Zweig von `generateFieldHTML`); bei normalisierten Feldern erschien zuvor eine leere Typ-Anzeige

## 1.19.0 - 2026-08-11
- FIX: Laufzeitzustand pro App-Instanz isoliert (F-42): Modul-Globale `loadedData`, `formDataStorage` und `currentPage` in ein pro `app()`-Aufruf geschlossenes `state`-Objekt (uid, root, config, loadedData, formDataStorage, currentPage) gezogen; `LoadJSONData(state)` liest Config und schreibt Daten nur noch über die Instanz (kein ambienter Zugriff auf das `configData`-Global aus app-base.js mehr), wodurch mehrere Instanzen unabhängig laden; Speichern/Laden von Seitenwerten läuft über `state.formDataStorage`

## 1.18.0 - 2026-08-11
- FIX: Ja/Nein- und Mehrfachauswahl-Antworten vollständig speichern (F-39): `saveCurrentPageData` liest für `ja-nein`-Felder die angeklickte Radio-Antwort („Ja"/„Nein", keine Auswahl → leer) und für `multiselect`-Felder die angeklickten Checkboxen als geordnete Werteliste in Optionen-Reihenfolge; `loadPageDataIntoFields` stellt Radios und Checkboxen aus dem Speicher wieder her; `collectFormData` führt Mehrfachauswahlen mit „, " zusammen, sodass sie vollständig in Bestätigungsseite und Mail-Payload erscheinen

## 1.17.0 - 2026-08-11
- FIX: XSS- und URL-Vertrag geschlossen (F-35): `safeHttpUrl` als Top-Level-Helfer ergänzt; der default-Zweig von `generateFieldHTML` rendert kein Eingabefeld mehr, sondern eine harmlose Konfigurationswarnung mit escaptem Feldtyp

## 1.16.0 - 2026-08-07
- FIX: Bootstrap-Ziele instanzeindeutig machen (F-32): `data-bs-target`, `aria-controls` und die div-IDs der Methodik-Box (`fo-methodik-body`) und der Box „Weitere Informationen" (`fo-weitere-infos-body`) werden pro App-Instanz mit einer UID versehen (`fo-methodik-body-i1`, `-i2`, …), damit mehrere Instanzen der App auf einer Seite nicht kollidieren

## 1.15.0 - 2026-08-07
- FIX: Dropdown-Optionen ohne `value` fallen auf den Label-Text zurück (Bestandsfehler im Formular-Generator, beim Browsernachweis Tranche 3 gefunden): `escapeHtml(option.value)` erzeugte bei Optionen ohne `value`-Attribut ein leeres `value=""`, dadurch blieb das Select leer und die Pflichtfeld-Validierung blockierte trotz getroffener Auswahl.

## 1.14.0 - 2026-08-06
- CHG: DOM-Zugriffe auf den App-Container gescopt (F-25, Tranche 3): alle Elemente der App werden über den App-Container (root.querySelector) angesprochen statt über document; unpräfixierte IDs mit `fo-`-Präfix versehen (`title-text-2` → `fo-title-text-2`, `formListContainer` → `fo-formListContainer`, `dynamicFormContainer` → `fo-dynamicFormContainer`, `prevButton` → `fo-prevButton`, `nextButton` → `fo-nextButton`, `submitButton` → `fo-submitButton`, `emailCopyCheckbox` → `fo-emailCopyCheckbox`, `emailAddress` → `fo-emailAddress`, `backToFormsButton` → `fo-backToFormsButton`, `backToFormSelectionButton` → `fo-backToFormSelectionButton`); dynamische Feld-IDs aus dem Formular-Schema werden an der Quelle präfixiert (`field.id = "fo-" + field.name`; Befund: `field.id` wird nur als DOM- und In-Memory-Speicher-ID genutzt, nicht im Submit-Payload)

## 1.13.0 - 2026-08-06
- FIX: Datenschutzangabe beschreibt den tatsaechlichen Stand nach dem Vendoring (Welle G)

## 1.12.0 - 2026-08-06
- FIX: Base auf Template oda-generic 1.6.0 vereinheitlicht (Hook renderPageOverride)

## 1.11.0 - 2026-08-04
- FIX: Datenschutzhinweis "Beim Aufruf kontaktierte Drittanbieter" an das Vendoring angepasst — jetzt lokal ausgelieferte Bibliotheken (Bootstrap/Leaflet/Chart.js) sind aus der Liste entfernt, weiterhin extern geladene Dienste (Kartenkacheln, Zusatzbibliotheken) bleiben genannt

## 1.10.0 - 2026-08-04
- FIX: Bootstrap vendored in `app/vendor/` statt von CDN geladen (F-07 Teil 2) — Standalone-Betrieb laedt diese Bibliotheken nicht mehr extern

## 1.9.0 - 2026-08-04
- FIX: Drittanbieter (CDN, Kartendienste) in `datenschutz`-Default und README dokumentiert (F-07 Teil 1)
- FIX: Bootstrap CSS/JS auf einheitlich 5.3.8 gezogen (vorher gemischt 5.3.0/5.3.1 bzw. 5.3.0/5.3.0) (F-31)
- FIX: lokale `odas-config/config.json`: leeres Pflichtfeld `datenschutz` mit dem App-Paket-Default befuellt

## 1.8.0 - 2026-07-31
- DOC: Abschnitt „Einschraenkung im Standalone-Betrieb" ergaenzt (F-04) - der
  Formularversand benoetigt den ODAS-Dienst `…/mail` und steht standalone nicht bereit
- DOC: Denselben Hinweis in die App-Beschreibung („Ueber diese App") aufgenommen

## 1.7.0 - 2026-07-31
- CHG: fehlendes Pflicht-Asset assets/branding.css ergaenzt und brandingCSSFile lokal aktiviert

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
