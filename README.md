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

## Betriebsarten

Die App kann lokal, eigenstaendig hinter einem Traefik-Reverse-Proxy oder ueber den ODAS
betrieben werden.

### Datenabruf: `proxyAktiv`

| Wert   | Bedeutung                                                                   |
| ------ | --------------------------------------------------------------------------- |
| `nein` | Direkter Abruf der Daten-URL. Standard fuer Entwicklung und Standalone.      |
| `ja`   | Abruf ueber den ODAS-Proxy `…/odp-data`. Nur im ODAS-Live-System verfuegbar. |

Bei `nein` muss die Datenquelle CORS freigeben.

### Standalone-Betrieb

> **Einschraenkung im Standalone-Betrieb.** Die Kernfunktion dieser App —
> Absenden eines ausgefuellten Formulars — benoetigt den ODAS-Plattformdienst `…/mail` und
> steht **ohne ODAS nicht zur Verfuegung**. Die App uebergibt das ausgefuellte Formular an den ODAS-Mailendpunkt `…/mail`.
Empfaenger und Versandweg liegen vollstaendig im ODAS-Backend.
> Die mitgelieferte `nginx.conf` kennt nur `/`, `= /config`, `/odas-config/` und
> `/assets/`; ein Request auf `…/mail` landet im Verzeichnis-Handler und
> ergibt 404. Die Schaltflaeche „Absenden" ist im Standalone-Betrieb
> daher wirkungslos.
>
> Alle uebrigen Funktionen — Oberflaeche, Konfiguration, Anzeige — laufen standalone
> vollstaendig. Wer die App eigenstaendig betreiben will, muss `…/mail` durch
> einen eigenen Dienst ersetzen; das ist derzeit **nicht** ueber die Konfiguration
> moeglich, sondern erfordert eine Codeanpassung.

Voraussetzung: ein laufender Traefik mit dem externen Docker-Netzwerk `proxynet`,
dem EntryPoint `websecure` und dem Zertifikatsresolver `letsencrypt`.

1. In `docker-compose.standalone.yml` den Platzhalter `app1.example.com` durch den
   echten FQDN ersetzen.
2. In `odas-config/config.json` `proxyAktiv` auf `nein` belassen.
3. Starten:

```bash
STANDALONE=true make up
STANDALONE=true make logs
STANDALONE=true make down
```

Im Standalone-Betrieb entfaellt die lokale Portfreigabe; Traefik terminiert TLS und
leitet auf den internen Nginx-Port 80 weiter. Die Konfiguration wird aus derselben
`odas-config/config.json` gelesen wie in der Entwicklung und von Nginx unter `/config`
ausgeliefert.

### Auslieferung an den ODAS

`make zip` erzeugt das Liefer-ZIP mit `app/`, `assets/`, `app-package.json` und
`CHANGELOG.md`. Die Infrastrukturdateien (`Dockerfile`, `docker-compose*.yml`,
`nginx.conf`, `Makefile`) sind nicht Teil der Auslieferung. Das ZIP ist ein Bauartefakt und wird nicht mitversioniert, sondern bei Bedarf mit `make zip` erzeugt.

## Autor

(C) 2025, Ondics GmbH
