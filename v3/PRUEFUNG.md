# Gestaltung 03.3.1 – Fotoausrichtung, 21.10.2026

- Vorher-Foto in der Browserdarstellung anhand von vier korrespondierenden Balkon-/Stützenecken auf die Fassadenebene des Nachher-Fotos ausgerichtet. Geometrische Perspektivkorrektur; die Originaldateien bleiben erhalten.
- Gemeinsamer Bildausschnitt auf Haus und Dach: x=180, y=145, 680 × 510 Pixel innerhalb der 1024 × 768 Originale. Kein wechselnder Bildmaßstab beim Bewegen des Reglers.
- Die feste Clipping-Ebene liegt außerhalb des transformierten Fotos, damit die Trennlinie immer unter dem Griff bleibt. Die Darstellung wird beim Ändern der Browserbreite neu berechnet.
- 1280 × 900, 547 × 729 und 390 × 844 im Browser geprüft. Vollansichten, 50-Prozent-Vergleich, Tastatur (Home/End), direktes Ziehen bis 75 Prozent und responsive Neuberechnung funktionieren. Kein horizontaler Überlauf oder Konsolenfehler.
- Struktur- und Skriptprüfung erfolgreich. Restliche Perspektivunterschiede außerhalb der gewählten Fassadenebene bleiben möglich und werden im Bildtext benannt.

## Bisheriger Prüfstand

## Gestaltung 03.3 – Prüfung vom 21.10.2026

## Größeres Modell und Fotovergleich

- Die Kamera rahmt das Haus und das angehobene Dach ein; zum Garten erweitert sie den Ausschnitt. Der äußere Modellsockel darf angeschnitten werden. Das eingeschobene Geschoss kommt von rechts ins Bild.
- Kleinere begleitende Typografie und eine deutlich größere Modellfläche. Sobald die Kopfzeile aus dem Bild gescrollt ist, wird deren Fläche für die Baugeschichte genutzt.
- 547 × 729: fertiger Neubau, Dachanhebung, teilweise eingeschobenes Geschoss bei 0,510 und vollständige Garage/Pergola bei 1,000 sichtbar geprüft.
- 1440 × 900: großes fertiges Neubau-Modell. 1280 × 720: angehobenes Dach mit eingeschobenem Geschoss und Umschalten zur ruhigen Ansicht (720 px Gesamthöhe).
- 390 × 844: Dachanhebung bei 0,440; 320 × 740: vollständiges Modell und ruhige Ansicht. Kein horizontaler Seitenüberlauf in den geprüften Größen.
- Dachgeschossausbau: die vorhandenen Originalfotos umbau-bestand.jpg und umbau-entwurf.jpg liegen als Vorher/Nachher-Vergleich übereinander. Ihre leicht unterschiedlichen Blickwinkel werden in der Bildunterschrift benannt.
- Direktes Ziehen im Browser verändert die Trennlinie (50 auf 80 Prozent Vorher geprüft). Home, End und die Schaltflächen zeigen die vollständigen Fotos; Vergleich setzt auf 50 Prozent zurück. Der native Regler hat einen verständlichen Namen und aktualisierten Werttext.
- Mobilansicht des Fotovergleichs bei 390 × 844 geprüft. Die Planzeichnung lässt sich darunter öffnen und bleibt als eigene Abbildung verfügbar. Kein Test auf einem physischen Touchgerät.
- Keine Konsolenfehler oder Warnungen. Die 16 vorhandenen Baufolge-/Formulartests sowie Struktur- und Syntaxprüfung erfolgreich. Nur Dateien in v3 geändert.

## Prüfprotokoll der vorherigen Gestaltung 03.2

## Neue Baugeschichten

- Neubau bei Fortschritt 0,300: eingeschossiges Haus vollständig, Dach auf 1,52 Modelleinheiten; zusätzliches Geschoss, Garage und Pergola fehlen noch.
- Ausbau bei 0,440: Dach auf 4,87 angehoben, zusätzliches Geschoss noch nicht vorhanden. Bei 0,510 ist es sichtbar teilweise eingeschoben. Nach dem Einschieben senkt sich das Dach auf 2,94.
- Zubau bei 0,851: Garage fertig, Terrassenboden entsteht. Bei 1,000 sind auch Stützen, Träger und offene Sparren der Pergola vollständig vorhanden.
- Fortschrittsleiste per Home, End, PageUp und Pfeiltasten bedient; Kapitelschalter und normales Scrollen geprüft. Kein erzwungenes Scrolltempo.
- 1440 × 900, 390 × 844 und 320 × 740: Neubau-, Ausbau- und Zubauansichten im Browser geprüft, kein horizontaler Seitenüberlauf.
- Ausbau-Kontakt übernimmt korrekt „Zubau / Ausbau“ und öffnet die freiwilligen Angaben.
- 1280 × 720: ruhige Ansicht zeigt das vollständige Haus mit zusätzlichem Geschoss, Garage und Pergola. Die Scrollstrecke verkürzt sich auf 720 px. Wiedereinschalten der Bewegung funktioniert; keine Konsolenfehler oder Warnungen.
- 547 × 729 (aktuelle Vorschaugröße): Dachanhebung bei 0,440 geprüft. Modell für mittlere Mobilbreiten tiefer angeordnet, sodass die Überschrift frei bleibt; CSS-Stand 3.2.1.
- Fünf neue Prüfungen kontrollieren Reihenfolge, Dachabstand, vollständige Endzustände und Rückwärtsdurchlauf der Baugeschichte. Zusammen mit den elf Formularprüfungen: 16 erfolgreich.
- Strukturprüfung und Skript-Syntax erfolgreich. Texte, Modell und Bewegungsfolge sind eigens erstellt; Three.js ist die mitgelieferte Darstellungsbibliothek.

## Bestehende Funktionsprüfung der Variante 03

- WebGL-Modell sichtbar; keine Konsolenfehler oder Warnungen beim Laden und Bedienen.
- Die frühere Perspektivfolge wurde durch die oben geprüften Baugeschichten ersetzt. Die Inhaltsabschnitte und Formularlogik blieben erhalten.
- „Bewegung anhalten“ setzt das Modell ruhig, verkürzt die Scrollstrecke auf die Einstiegshöhe und erhält die weiteren Inhalte. „Bewegung zulassen“ stellt die Sequenz wieder her.
- Desktop: 1280 × 720 und 1440 × 900. Mobil: 390 × 844 und 320 × 740. Kein horizontaler Seitenüberlauf. Schrift und Modell auf Mobilgeräten getrennt angeordnet.
- Mobiles Menü öffnet, führt zum gewünschten Abschnitt und schließt wieder.
- Projektansichten Bestand, Plan und Foto danach laden die richtigen lokalen Dateien.
- FAQ-Suche „Pergola“ findet die passende Frage.
- Formular mit einer Telefonnummer allein erfolgreich getestet: sichtbare Bestätigung, dass nichts verschickt wurde. Genau ein Pflichtfeld.
- E-Mail-Adresse mit freiwilliger PDF-Auswahl getestet; eine zusätzlich gewählte TXT-Datei erhält einen konkreten Hinweis, während die gültige PDF ausgewählt bleibt. Testbestätigung zählt genau eine Datei, ohne Versand.

## Automatisch und im Code geprüft

- Strukturprüfung für V2 und V3: lokale Ressourcen, interne Links, eindeutige IDs, Formularzuordnung, genau ein h1 und genau ein Pflichtfeld.
- Alle elf vorhandenen Prüfungen der gemeinsamen Formularregeln erfolgreich; Syntaxprüfung beider V3-Skripte erfolgreich.
- Systemeinstellung `prefers-reduced-motion` nutzt denselben ruhigen Darstellungspfad wie der getestete Bewegungsschalter. Die tatsächliche Systemeinstellung wurde nicht verändert.
- Statische SVG-Ersatzdarstellung ist vor dem ersten erfolgreichen Rendern sichtbar; Modul-/WebGL-Fehler und Kontextverlust führen zur statischen Ansicht. Ein Grafiktreiberfehler wurde nicht künstlich ausgelöst.
- Render-Schleife läuft nur bei einer Änderung im sichtbaren Einstieg. Keine Analyse-, Upload- oder Speicheranbindung.

## Geltungsbereich

Gestaltungsvorschau. Kein produktiver Formulareingang und keine technische Prüfung der illustrativen Hausgeometrie. Kein Test auf jedem physischen Mobilgerät. Die gesetzlichen Erstinformationen und fachlichen Leistungsangaben wurden in dieser Designrunde inhaltlich nicht geändert. Echte Projektbilder stammen aus dem bisherigen Büroauftritt; das 3D-Modell ist kein Kundenprojekt.
