# Weissensteiner – Website-Entwürfe

Gestaltungsvorschau für das Bauzeichenbüro Ing. Josef Weissensteiner in St. Pölten. Keine veröffentlichte Geschäftswebsite, kein produktiver Anfrageeingang.

- **Variante 03 – Raum zum Weiterdenken:** https://x10aix.github.io/weissensteiner-website/v3/
- **Variante 02 – Zukunft braucht einen Plan:** https://x10aix.github.io/weissensteiner-website/
- **Erste Fassung zum Vergleich:** https://x10aix.github.io/weissensteiner-website/v1/

## Gestaltung 03

Ein räumlicher Einstieg mit einem eigens aufgebauten, illustrativen Hausmodell. Beim normalen Scrollen fügen sich Dach, Obergeschoss, Erdgeschoss und Gartenflügel zusammen; anschließend öffnet sich das Dach und die Kamera zeigt den Grundriss. Die drei Stationen sind auch über Schaltflächen erreichbar. Große Typografie, warmer Kupferton und eine helle Modellbaufläche bestimmen den Einstieg. Die folgenden Abschnitte führen durch Vorhaben, echte Projektabbildungen, Zusammenarbeit, Bauwissen, Vorbereitung und Kontakt.

Das Modell ist ausdrücklich eine freie Illustration, kein ausgeführtes Projekt von Josef und keine technische Bauplanung. Die bisherigen Varianten bleiben unverändert erreichbar. V3 liegt vollständig im Unterverzeichnis `v3/` und verwendet die vorhandenen Bilder, Schrift und Formularregeln aus dem Hauptverzeichnis.

Die Animation verwendet lokal mitgeliefertes Three.js 0.186.1 (MIT-Lizenz in `v3/vendor/THREE-LICENSE.txt`). Quelle: https://registry.npmjs.org/three/-/three-0.186.1.tgz. Technische Referenz: https://threejs.org/docs/pages/WebGLRenderer. Es gibt keinen Bibliotheksaufruf bei einem Drittanbieter im Besucherbrowser.

Die Scrollposition bleibt nativ; es gibt weder erzwungene Scrollgeschwindigkeit noch eine Eingabesperre. Ein Schalter hält die Bewegung an und verkürzt den Einstieg. Die Systemeinstellung für reduzierte Bewegung führt direkt zur ruhigen Darstellung. Außerhalb des sichtbaren Einstiegs, bei verborgenem Tab und nach Abschluss einer Bewegung wird keine kontinuierliche Render-Schleife betrieben. Wenn WebGL oder das Modul nicht verfügbar ist, bleibt eine statische Illustration sichtbar und die lange Scrollstrecke entfällt.

Desktop und Mobilansichten sind unterschiedlich komponiert. Prüfung: `python tests/check-structure.py v3`, `node --test tests/form-rules.test.cjs`. Details der manuellen Prüfung in `v3/PRUEFUNG.md`.

## Gestaltung 02

„Zukunft braucht einen Plan“: eine Zeichenfläche mit einem direkt bedienbaren Plan-/Foto-Vergleich, große Manrope-Typografie, dunkle Grün- und warme Papierfarben, ein apricotfarbener Akzent, ein eigenes Linienzeichen und unterschiedlich gewichtete Projektansichten. Die Bildansicht lässt sich per Maus, Touch, Schieberegler, Tastatur und den Schaltflächen Plan/Foto bedienen. Reduzierte Bewegung wird berücksichtigt.

## Inhalt und Funktionen

Neubau, Zubau/Ausbau, Umbau/Renovierung sowie Carport, Pergola und Gartenhütte; NÖ-Erstinformation mit Quellenstand 21.10.2026, Arbeitsweise als Textentwurf, 18 durchsuchbare Fragen, Vorbereitungsliste, Projektansichten und Ansprechpartner.

Das Formular benötigt nur eine Telefonnummer ODER E-Mail-Adresse. Weitere Angaben und Dateien sind freiwillig. Es prüft nur im Browser: kein Versand, kein Upload, keine dauerhafte Speicherung. Das direkte Mail- und Telefonangebot wird erst durch bewussten Klick geöffnet.

## Betrieb

Statische Dateien ohne Installation oder Build. GitHub Pages veröffentlicht den Hauptzweig. Lokale Vorschau: `python -m http.server 49682 --bind 127.0.0.1`.

Die Vorschau enthält keine Analysedienste und lädt die Manrope-Schrift selbst. Beim Onlineaufruf verarbeitet GitHub Pages technisch erforderliche Verbindungsdaten. Suchmaschinen werden über `noindex,nofollow` und `robots.txt` um Nichtindexierung gebeten; das ist kein Zugriffsschutz.

Für den späteren Echtbetrieb ist planung@buero-weissensteiner.at als Empfänger festgelegt. Dateiablage und Betriebsprozess bleiben offen. Leistungszuordnung, Projektbeiträge, Bilder, vollständige Firmendaten und Rechtstexte werden vor der Geschäftsveröffentlichung bestätigt. Die vorhandene Geschäftswebsite und Domain werden durch diese Vorschau nicht verändert.

## Herkunft

Projektbilder, Zeichnungen und Porträt aus dem bestehenden öffentlichen Büroauftritt: https://www.xn--bro-weissensteiner-m6b.at/. Eine Veröffentlichung dieses Entwurfs ist keine Freigabe zur anderweitigen Verwendung der Bilder. Keine erfundenen Projekte oder Kundenstimmen. Die Zeichnung und das Foto im Vergleich zeigen unterschiedliche Darstellungen, keinen maßstäblich deckungsgleichen Vorher-/Nachher-Vergleich.

Manrope von Mikhail Sharanda und den Manrope Project Authors, SIL Open Font License 1.1; Lizenz in `assets/fonts/OFL.txt`, Quelle: https://github.com/google/fonts/tree/main/ofl/manrope.

## Geprüft

Desktopansicht (1.440 px) und schmale Ansichten (390 und 320 px) ohne horizontalen Seitenüberlauf; Plan-/Foto-Schaltflächen, Tastatur und direktes Ziehen im Bild; mobiles Menü; FAQ-Suche; Anfrage mit Telefonnummer allein. Die elf Formularprüfungen und die Strukturprüfung sind erfolgreich. Kein echter Versand oder Upload getestet, da absichtlich nicht angebunden.
