const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const rules = require('../form-rules.js');
const mb = 1024 * 1024;
const file = (name, size = 100, lastModified = 1) => ({name, size, lastModified});

test('Telefonnummer oder E-Mail genügt ohne weitere Kontaktdaten', () => {
  for (const value of ['test@example.invalid', '  anfrage+plan@example.at  ', '0676 / 123 45 67', '+43 (676) 1234567', '0043-676-1234567']) {
    assert.equal(rules.validateContact(value).valid, true, value);
  }
  assert.equal(rules.validateContact('test@example.invalid').kind, 'E-Mail-Adresse');
  assert.equal(rules.validateContact('0676 / 123 45 67').kind, 'Telefonnummer');
});
test('Leere und offensichtlich ungültige Kontaktangaben erhalten konkrete Fehler', () => {
  for (const value of ['', ' ', 'Name ohne Kontakt', 'test@', 'a@b', 'a b@example.at', '@example.at', '123', '+43 CALL ME', '++436761234567', '1234567890123456']) {
    const result = rules.validateContact(value);
    assert.equal(result.valid, false, value); assert.ok(result.error.length > 10);
  }
});
test('Mehrere Fotos und Dokumente können ohne Nachricht ausgewählt werden', () => {
  const result = rules.addFiles([], [file('Foto.JPG'), file('Grundriss.pdf'), file('Telefonfoto.HEIC'), file('Skizze.png')]);
  assert.equal(result.files.length, 4); assert.deepEqual(result.errors, []);
});
test('Kleine Dateien erscheinen mit lesbarer Größe statt als 0,0 MB', () => {
  assert.equal(rules.formatFileSize(431), '431 Byte');
  assert.equal(rules.formatFileSize(1024), '1,0 KB');
  assert.equal(rules.formatFileSize(182821), '178,5 KB');
  assert.equal(rules.formatFileSize(mb), '1,0 MB');
});
test('Ein problematischer Anhang verhindert gültige Anhänge nicht', () => {
  const result = rules.addFiles([], [file('plan.pdf'), file('programm.exe'), file('zu-gross.jpg', 16 * mb), file('foto.png')]);
  assert.deepEqual(result.files.map(x => x.name), ['plan.pdf', 'foto.png']); assert.equal(result.errors.length, 2);
});
test('Einzelgröße wird auch genau an der Grenze geprüft', () => {
  assert.equal(rules.addFiles([], [file('ok.pdf', 15 * mb)]).files.length, 1);
  assert.equal(rules.addFiles([], [file('gross.pdf', 15 * mb + 1)]).files.length, 0);
  assert.equal(rules.addFiles([], [file('leer.pdf', 0)]).files.length, 0);
});
test('Gesamtgröße gilt über mehrere Auswahlvorgänge', () => {
  const first = rules.addFiles([], [file('1.pdf', 15 * mb), file('2.pdf', 15 * mb)]);
  const second = rules.addFiles(first.files, [file('3.pdf', 15 * mb), file('4.pdf', 5 * mb), file('5.jpg', 1)]);
  assert.equal(second.files.length, 4); assert.equal(second.errors.length, 1);
  assert.equal(second.files.reduce((sum, f) => sum + f.size, 0), 50 * mb);
});
test('Anzahlbegrenzung gilt über mehrere Auswahlvorgänge', () => {
  const first = rules.addFiles([], Array.from({length: 9}, (_, i) => file(i + '.pdf')));
  const second = rules.addFiles(first.files, [file('10.pdf'), file('11.pdf')]);
  assert.equal(second.files.length, 10); assert.equal(second.errors.length, 1);
});
test('Duplikate werden erkannt und bestehende Auswahl bleibt unverändert', () => {
  const existing = [file('Plan.pdf')];
  const result = rules.addFiles(existing, [file('Plan.pdf'), file('Foto.jpg')]);
  assert.equal(existing.length, 1); assert.equal(result.files.length, 2); assert.match(result.errors[0], /bereits ausgewählt/);
});
test('HTML hat genau ein Pflichtfeld, Mehrfachauswahl und einen abgesicherten Testknopf', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.equal((html.match(/\srequired(?:\s|>)/g) || []).length, 1);
  assert.match(html, /id="contact"[^>]*required/);
  assert.match(html, /id="files"[^>]*multiple/);
  assert.match(html, /id="submit-button"[^>]*disabled/);
  assert.match(html, /noindex,nofollow/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:|<link[^>]+href="https?:/);
});
test('Lokaler Formulartest hat keinen Netzwerk- oder Speicherpfad', () => {
  const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  assert.doesNotMatch(app, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.innerHTML\s*=/);
  assert.match(app, /event\.preventDefault\(\)/);
  assert.match(app, /Es wurde nichts verschickt/);
});
