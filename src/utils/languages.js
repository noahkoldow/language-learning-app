/**
 * Language utilities for the language learning app
 * Contains supported languages with flag emojis for the UI
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'Englisch', flag: '🇬🇧' },
  { code: 'fr', name: 'Französisch', flag: '🇫🇷' },
  { code: 'es', name: 'Spanisch', flag: '🇪🇸' },
  { code: 'it', name: 'Italienisch', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugiesisch', flag: '🇵🇹' },
  { code: 'nl', name: 'Niederländisch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polnisch', flag: '🇵🇱' },
  { code: 'ru', name: 'Russisch', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinesisch', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanisch', flag: '🇯🇵' },
  { code: 'ko', name: 'Koreanisch', flag: '🇰🇷' },
];

/**
 * Get language object by code
 * @param {string} code - Language code (e.g., 'de', 'en')
 * @returns {object|undefined} Language object or undefined if not found
 */
export function getLanguageByCode(code) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get language name by code
 * @param {string} code - Language code
 * @returns {string} Language name or the code itself if not found
 */
export function getLanguageName(code) {
  const lang = getLanguageByCode(code);
  return lang ? lang.name : code;
}

export default SUPPORTED_LANGUAGES;
