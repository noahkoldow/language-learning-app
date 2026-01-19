// LibreTranslate API Service
// Free translation service with no API key required

const LIBRE_TRANSLATE_URLS = [
  'https://libretranslate.com/translate',
  'https://translate.argosopentech.com/translate'
];

// Language code mapping for LibreTranslate
const LANGUAGE_MAP = {
  'English': 'en',
  'German': 'de',
  'Spanish': 'es',
  'French': 'fr',
  'Italian': 'it',
  'Portuguese': 'pt',
  'Russian': 'ru',
  'Chinese': 'zh',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Arabic': 'ar',
  'Dutch': 'nl',
  'Polish': 'pl',
  'Turkish': 'tr',
};

/**
 * Convert language name to LibreTranslate code
 * @param {string} language - Language name
 * @returns {string} - Language code
 */
function getLanguageCode(language) {
  return LANGUAGE_MAP[language] || language.toLowerCase().substring(0, 2);
}

/**
 * Translate text using LibreTranslate API
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
export async function translateWithLibre(text, sourceLang, targetLang) {
  const sourceCode = getLanguageCode(sourceLang);
  const targetCode = getLanguageCode(targetLang);

  // Try each LibreTranslate instance
  for (const url of LIBRE_TRANSLATE_URLS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceCode,
          target: targetCode,
          format: 'text',
        }),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.translatedText) {
        return data.translatedText;
      }
      
      throw new Error('No translation returned');
    } catch (error) {
      console.warn(`LibreTranslate failed with ${url}:`, error.message);
      // Continue to next URL
    }
  }

  throw new Error('All LibreTranslate instances failed');
}

/**
 * Check if LibreTranslate is available
 * @returns {Promise<boolean>}
 */
export async function isLibreTranslateAvailable() {
  try {
    const response = await fetch(LIBRE_TRANSLATE_URLS[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: 'test',
        source: 'en',
        target: 'de',
        format: 'text',
      }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  translateWithLibre,
  isLibreTranslateAvailable,
};
