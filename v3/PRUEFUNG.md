# Gestaltung 03 – Prüfung vom 21.10.2026

## Im Browser geprüft

- WebGL-Modell sichtbar; keine Konsolenfehler oder Warnungen beim Laden und Bedienen.
- Normales Scrollen verändert Aufbau, Drehung, Kamerahöhe und Dachöffnung. Die Folge ist rückwärts durchlaufbar.
- Drei Stationen über die Schaltflächen Idee, Raum und Plan erreichbar.
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
