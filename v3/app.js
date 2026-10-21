'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() {menuButton.setAttribute('aria-expanded', 'false'); delete navigation.dataset.open;}
menuButton.addEventListener('click', () => {const next = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(next)); navigation.dataset.open = String(next);});
navigation.addEventListener('click', event => {if (event.target.closest('a')) closeMenu();});
document.addEventListener('keydown', event => {if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {closeMenu(); menuButton.focus();}});

const tabs = [...document.querySelectorAll('[role=tab]')];
function selectTab(tab, focus) {
  tabs.forEach(item => {const chosen = item === tab; item.setAttribute('aria-selected', String(chosen)); item.tabIndex = chosen ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !chosen;});
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab, false));
  tab.addEventListener('keydown', event => {
    const direction = {ArrowRight: 1, ArrowLeft: -1}[event.key];
    let next = direction ? (index + direction + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) {event.preventDefault(); selectTab(tabs[next], true);}
  });
});

// A clipped original photograph sits above the after photograph. The native
// range remains the single focusable slider; pointer gestures use the full image.
const comparison = document.getElementById('project-comparison');
const comparisonRange = document.getElementById('project-comparison-range');
const comparisonButtons = [...document.querySelectorAll('[data-comparison]')];
function updateComparison(value) {
  const before = Math.max(0, Math.min(100, Math.round(Number(value))));
  comparisonRange.value = before;
  comparison.style.setProperty('--before', before + '%');
  comparisonRange.setAttribute('aria-valuetext', before === 0 ? 'Nur Nachher' : before === 100 ? 'Nur Vorher' : before + ' Prozent Vorher, ' + (100 - before) + ' Prozent Nachher');
  comparisonButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.comparison) === before)));
  comparison.querySelector('.comparison-label-before').hidden = before < 15;
  comparison.querySelector('.comparison-label-after').hidden = before > 85;
}
comparisonRange.addEventListener('input', () => updateComparison(comparisonRange.value));
comparisonButtons.forEach(button => button.addEventListener('click', () => updateComparison(button.dataset.comparison)));
let comparisonPointer = null;
function moveComparison(event) {
  const rect = comparison.getBoundingClientRect();
  updateComparison((event.clientX - rect.left) / rect.width * 100);
}
comparison.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  comparisonPointer = event.pointerId;
  comparisonRange.focus({preventScroll: true});
  comparison.setPointerCapture(event.pointerId);
  moveComparison(event);
  // Keep the native range from applying its own different thumb geometry.
  event.preventDefault();
});
comparison.addEventListener('pointermove', event => {if (event.pointerId === comparisonPointer) moveComparison(event);});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) comparison.addEventListener(type, event => {
  if (event.pointerId !== comparisonPointer) return;
  if (comparison.hasPointerCapture(event.pointerId)) comparison.releasePointerCapture(event.pointerId);
  comparisonPointer = null;
});
comparisonRange.disabled = false;
document.querySelector('.comparison-toolbar').hidden = false;
updateComparison(comparisonRange.value);

const faqSearch = document.getElementById('faq-search');
const questions = [...document.querySelectorAll('#faq-list > details')];
function normalize(value) {return value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');}
faqSearch.addEventListener('input', () => {
  const terms = normalize(faqSearch.value.trim()).split(/\s+/).filter(Boolean);
  let shown = 0;
  questions.forEach(question => {const match = terms.every(term => normalize(question.textContent).includes(term)); question.hidden = !match; if (match) shown++;});
  document.getElementById('faq-count').textContent = shown + (shown === 1 ? ' Frage' : ' Fragen') + (terms.length ? ' gefunden' : '');
  document.getElementById('faq-empty').hidden = shown !== 0;
});

const form = document.getElementById('contact-form');
const contact = document.getElementById('contact');
const contactError = document.getElementById('contact-error');
const result = document.getElementById('form-result');
let selectedFiles = [];
function resetResult() {result.hidden = true; result.replaceChildren();}
form.addEventListener('input', resetResult);
contact.addEventListener('input', () => {contact.removeAttribute('aria-invalid'); contactError.hidden = true;});
function showFileErrors(errors) {const box = document.getElementById('file-errors'); box.textContent = errors.join('\n'); box.hidden = errors.length === 0;}
function renderFiles() {
  const list = document.getElementById('file-list'); list.replaceChildren();
  selectedFiles.forEach((file, index) => {
    const li = document.createElement('li'), text = document.createElement('span'), size = document.createElement('small'), remove = document.createElement('button');
    text.textContent = file.name; size.textContent = FormRules.formatFileSize(file.size); text.append(size);
    remove.type = 'button'; remove.textContent = 'Entfernen'; remove.setAttribute('aria-label', file.name + ' entfernen');
    remove.addEventListener('click', () => {selectedFiles.splice(index, 1); resetResult(); showFileErrors([]); renderFiles(); const next = list.querySelectorAll('button')[Math.min(index, selectedFiles.length - 1)]; (next || document.getElementById('files')).focus();});
    li.append(text, remove); list.append(li);
  });
}
document.getElementById('files').addEventListener('change', event => {
  resetResult(); const next = FormRules.addFiles(selectedFiles, [...event.target.files]); selectedFiles = next.files; showFileErrors(next.errors); renderFiles(); event.target.value = '';
});
document.querySelectorAll('[data-intent]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('intent').value = link.dataset.intent;
  document.getElementById('optional-fields').open = true; resetResult();
}));
document.querySelectorAll('a[href="#datenschutz"],a[href="#rechtliches"],a[href="#quellen"]').forEach(link => link.addEventListener('click', () => {document.querySelector(link.getAttribute('href')).open = true;}));
form.addEventListener('submit', event => {
  event.preventDefault(); resetResult();
  const checked = FormRules.validateContact(contact.value);
  if (!checked.valid) {contactError.textContent = checked.error; contactError.hidden = false; contact.setAttribute('aria-invalid', 'true'); contact.focus(); return;}
  contactError.hidden = true; contact.removeAttribute('aria-invalid');
  const title = document.createElement('strong'), text = document.createElement('p');
  title.textContent = 'Der lokale Formulartest war erfolgreich.';
  text.textContent = 'Ihre ' + checked.kind + ' wurde als Kontaktangabe erkannt. ' + selectedFiles.length + (selectedFiles.length === 1 ? ' Datei ist' : ' Dateien sind') + ' ausgewählt. Es wurde nichts verschickt. In der fertigen Webseite würde hier die bestätigte Annahme Ihrer Anfrage erscheinen.';
  result.append(title, text); result.hidden = false; result.focus();
});
document.getElementById('submit-button').disabled = false;
