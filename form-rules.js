(function (root) {
  'use strict';
  const MAX_FILES = 10, MAX_FILE_BYTES = 15 * 1024 * 1024, MAX_TOTAL_BYTES = 50 * 1024 * 1024;
  function validateContact(raw) {
    const value = String(raw || '').trim();
    if (!value) return {valid: false, error: 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.'};
    if (value.includes('@')) {
      return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(value) && value.length <= 254
        ? {valid: true, kind: 'E-Mail-Adresse', value}
        : {valid: false, error: 'Bitte prüfen Sie die E-Mail-Adresse, zum Beispiel name@beispiel.at.'};
    }
    const digits = value.replace(/\D/g, '');
    return /^\+?[\d\s()/.-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
      ? {valid: true, kind: 'Telefonnummer', value}
      : {valid: false, error: 'Bitte geben Sie eine erreichbare Telefonnummer mit Vorwahl oder eine E-Mail-Adresse an.'};
  }
  function fileKey(file) {return [file.name, file.size, file.lastModified || 0].join('|');}
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes.toLocaleString('de-AT') + ' Byte';
    const unit = bytes < 1024 * 1024 ? ' KB' : ' MB';
    const divisor = unit === ' KB' ? 1024 : 1024 * 1024;
    return (bytes / divisor).toLocaleString('de-AT', {maximumFractionDigits: 1, minimumFractionDigits: 1}) + unit;
  }
  function addFiles(existing, incoming) {
    const accepted = [...existing], errors = [];
    for (const file of incoming) {
      if (!/\.(jpe?g|png|heic|pdf)$/i.test(file.name)) {errors.push(file.name + ': Bitte JPG, PNG, HEIC oder PDF wählen.'); continue;}
      if (file.size === 0) {errors.push(file.name + ': Die Datei ist leer.'); continue;}
      if (file.size > MAX_FILE_BYTES) {errors.push(file.name + ': Die Datei ist größer als 15 MB.'); continue;}
      if (accepted.some(item => fileKey(item) === fileKey(file))) {errors.push(file.name + ': Diese Datei ist bereits ausgewählt.'); continue;}
      if (accepted.length >= MAX_FILES) {errors.push(file.name + ': Es sind höchstens 10 Dateien möglich.'); continue;}
      if (accepted.reduce((sum, item) => sum + item.size, 0) + file.size > MAX_TOTAL_BYTES) {errors.push(file.name + ': Die Auswahl überschreitet insgesamt 50 MB.'); continue;}
      accepted.push(file);
    }
    return {files: accepted, errors};
  }
  const api = {validateContact, addFiles, fileKey, formatFileSize, MAX_FILES, MAX_FILE_BYTES, MAX_TOTAL_BYTES};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FormRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
