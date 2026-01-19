// Supported Languages for Translation
// This file contains the list of all languages available in the app

export const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

/**
 * Get language by code
 * @param {string} code - Language code
 * @returns {object|null} - Language object or null if not found
 */
export function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || null;
}

/**
 * Get language by name
 * @param {string} name - Language name
 * @returns {object|null} - Language object or null if not found
 */
export function getLanguageByName(name) {
  return SUPPORTED_LANGUAGES.find(lang => lang.name === name) || null;
}

/**
 * Get language code by name
 * @param {string} name - Language name
 * @returns {string|null} - Language code or null if not found
 */
export function getLanguageCode(name) {
  const lang = getLanguageByName(name);
  return lang ? lang.code : null;
}

/**
 * Get language name by code
 * @param {string} code - Language code
 * @returns {string|null} - Language name or null if not found
 */
export function getLanguageName(code) {
  const lang = getLanguageByCode(code);
  return lang ? lang.name : null;
}
