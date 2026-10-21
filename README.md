# Weissensteiner – Website-Entwürfe

Gestaltungsvorschau für das Bauzeichenbüro Ing. Josef Weissensteiner in St. Pölten. Keine veröffentlichte Geschäftswebsite, kein produktiver Anfrageeingang.

- **Neue Fassung:** https://x10aix.github.io/weissensteiner-website/
- **Erste Fassung zum Vergleich:** https://x10aix.github.io/weissensteiner-website/v1/

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
