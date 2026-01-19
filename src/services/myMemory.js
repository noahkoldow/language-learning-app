// MyMemory Translation API Service
// Free translation service (1000 words/day limit, no API key required)

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

// Language code mapping for MyMemory
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
 * Convert language name to MyMemory code
 * @param {string} language - Language name
 * @returns {string} - Language code
 */
function getLanguageCode(language) {
  return LANGUAGE_MAP[language] || language.toLowerCase().substring(0, 2);
}

/**
 * Translate text using MyMemory API
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
export async function translateWithMyMemory(text, sourceLang, targetLang) {
  const sourceCode = getLanguageCode(sourceLang);
  const targetCode = getLanguageCode(targetLang);
  const langPair = `${sourceCode}|${targetCode}`;

  try {
    // For long texts, split by paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length > 1) {
      // Translate each paragraph separately
      const translations = await Promise.all(
        paragraphs.map(p => translateSingleText(p, langPair))
      );
      return translations.join('\n\n');
    } else {
      return await translateSingleText(text, langPair);
    }
  } catch (error) {
    throw new Error(`MyMemory translation failed: ${error.message}`);
  }
}

/**
 * Translate a single text segment
 * @param {string} text - Text to translate
 * @param {string} langPair - Language pair (e.g., 'en|de')
 * @returns {Promise<string>} - Translated text
 */
async function translateSingleText(text, langPair) {
  const url = new URL(MYMEMORY_API_URL);
  url.searchParams.append('q', text);
  url.searchParams.append('langpair', langPair);

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal: AbortSignal.timeout(15000), // 15 second timeout
  });

  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory error: ${data.responseDetails || 'Unknown error'}`);
  }

  if (!data.responseData || !data.responseData.translatedText) {
    throw new Error('No translation returned from MyMemory');
  }

  return data.responseData.translatedText;
}

/**
 * Check if MyMemory is available
 * @returns {Promise<boolean>}
 */
export async function isMyMemoryAvailable() {
  try {
    const url = new URL(MYMEMORY_API_URL);
    url.searchParams.append('q', 'test');
    url.searchParams.append('langpair', 'en|de');

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return false;
    
    const data = await response.json();
    return data.responseStatus === 200;
  } catch {
    return false;
  }
}

export default {
  translateWithMyMemory,
  isMyMemoryAvailable,
};
