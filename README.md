# ODAS App Formular

Formular-App für den Open Data App-Store (ODAP)

Die App Formulare bietet Formulare zum Ausfüllen an.

Die App ist eine "ODAP App V1".

## Funktionen

- Auswahl zwischen mehreren Formularen aus einer Liste
- Mehrseitige Formulare mit Textfeldern, Dropdowns, Ja-Nein-Auswahl und Multiselect
- Bestätigungsformular mit E-Mail-Kopie
- Zusammenfassung der Eingaben vor dem Absenden
- Validierung von Pflichtfeldern

## Für wen ist diese App?

Diese App ermöglicht das digitale Ausfüllen und Einreichen von Formularen. Sie richtet sich an Bürger:innen, die Behördengänge online erledigen möchten.

## Entwicklung

### Aufbau der App

#### Desktop Version

![Alt-Text](/assets/Desktop_Screenshot.png)
![Alt-Text](/assets/Desktop_Screenshot_2.png)
![Alt-Text](/assets/Desktop_Screenshot_3.png)
![Alt-Text](/assets/Desktop_Screenshot_4.png)

#### Mobile Version

![Alt-Text](/assets/Mobile_Screenshot.png)

### Lokale Entwicklung mit VS Code Live Server

Die App kann mit VS Code Live Server aus der Projektwurzel gestartet werden. Öffne dann `http://127.0.0.1:<live-server-port>/app/`; Live Server nutzt standardmäßig Port `5500`.

### Start der App

    $ make build up
    $ curl http://localhost:8089

## Autor

(C) 2025, Ondics GmbH
