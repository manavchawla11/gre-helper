const KEY = 'gre_locale';

export const SUPPORTED_LOCALES = [
  { code: 'en-us', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
];

export function getSavedLocale() {
  return localStorage.getItem(KEY) || 'en-us';
}

export function saveLocale(locale) {
  localStorage.setItem(KEY, locale);
}
