// Rule-based Text Simplification Service
// Simplifies text based on CEFR level without AI

// Complex to simple word mappings (primarily for English and German)
const SIMPLE_WORDS_EN = {
  'utilize': 'use',
  'purchase': 'buy',
  'approximately': 'about',
  'commence': 'start',
  'terminate': 'end',
  'demonstrate': 'show',
  'acquire': 'get',
  'assistance': 'help',
  'sufficient': 'enough',
  'prior': 'before',
  'subsequent': 'after',
  'additional': 'more',
  'obtain': 'get',
  'possess': 'have',
  'comprehend': 'understand',
  'endeavor': 'try',
  'facilitate': 'help',
  'implement': 'do',
  'nevertheless': 'but',
  'consequently': 'so',
  'therefore': 'so',
  'furthermore': 'also',
  'however': 'but',
  'regarding': 'about',
  'concerning': 'about',
  'enormous': 'huge',
  'minuscule': 'tiny',
  'substantial': 'big',
  'diminish': 'reduce',
  'increase': 'grow',
  'ascertain': 'find out',
  'component': 'part',
  'construct': 'build',
  'modify': 'change',
};

const SIMPLE_WORDS_DE = {
  'verwenden': 'benutzen',
  'erwerben': 'kaufen',
  'ungefähr': 'etwa',
  'beginnen': 'anfangen',
  'beenden': 'aufhören',
  'demonstrieren': 'zeigen',
  'erhalten': 'bekommen',
  'Unterstützung': 'Hilfe',
  'ausreichend': 'genug',
  'vorher': 'früher',
  'nachher': 'später',
  'zusätzlich': 'mehr',
  'besitzen': 'haben',
  'begreifen': 'verstehen',
  'versuchen': 'probieren',
  'dennoch': 'aber',
  'folglich': 'also',
  'außerdem': 'auch',
  'jedoch': 'aber',
  'bezüglich': 'über',
  'enorm': 'sehr groß',
  'erheblich': 'groß',
  'verringern': 'weniger machen',
};

/**
 * Get word replacements for a specific language
 * @param {string} language - Language name
 * @returns {object} - Word mapping
 */
function getWordReplacements(language) {
  const lang = language.toLowerCase();
  if (lang.includes('german') || lang.includes('deutsch')) {
    return SIMPLE_WORDS_DE;
  }
  // Default to English
  return SIMPLE_WORDS_EN;
}

/**
 * Split long sentences at conjunctions and punctuation
 * @param {string} text - Text to split
 * @returns {string} - Split text
 */
function splitLongSentences(text) {
  // Split at commas, semicolons, and conjunctions
  const sentences = text.split(/\.\s+/);
  
  const simplified = sentences.map(sentence => {
    // If sentence is too long (> 15 words), try to split it
    const words = sentence.trim().split(/\s+/);
    if (words.length > 15) {
      // Split at first comma, 'and', 'or', 'but'
      let split = sentence
        .replace(/,\s+/g, '. ')
        .replace(/\s+and\s+/gi, '. ')
        .replace(/\s+or\s+/gi, '. ')
        .replace(/\s+but\s+/gi, '. ')
        .replace(/\s+und\s+/gi, '. ') // German
        .replace(/\s+oder\s+/gi, '. ') // German
        .replace(/\s+aber\s+/gi, '. '); // German
      
      return split;
    }
    return sentence;
  }).join('. ');

  return simplified;
}

/**
 * Replace complex words with simpler alternatives
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @returns {string} - Simplified text
 */
function replaceComplexWords(text, language) {
  const replacements = getWordReplacements(language);
  let simplified = text;

  for (const [complex, simple] of Object.entries(replacements)) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  }

  return simplified;
}

/**
 * Simplify text based on CEFR level
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @param {string} targetLevel - Target CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns {string} - Simplified text
 */
export function simplifyForLevel(text, language, targetLevel) {
  // C1 and C2 levels don't need simplification
  if (targetLevel === 'C1' || targetLevel === 'C2') {
    return text;
  }

  let simplified = text;

  // For all levels below C1, replace complex words
  simplified = replaceComplexWords(simplified, language);

  // For A1 and A2, also split long sentences
  if (targetLevel === 'A1' || targetLevel === 'A2') {
    simplified = splitLongSentences(simplified);
  }

  return simplified;
}

/**
 * Get simplified version with translation side by side
 * This is a fallback when true simplification isn't possible
 * @param {string} originalText - Original text
 * @param {string} translatedText - Translated text
 * @returns {string} - Combined text
 */
export function combineOriginalAndTranslation(originalText, translatedText) {
  // Split by paragraphs
  const originalParagraphs = originalText.split('\n\n').filter(p => p.trim());
  const translatedParagraphs = translatedText.split('\n\n').filter(p => p.trim());

  // Combine side by side
  const combined = originalParagraphs.map((orig, idx) => {
    const trans = translatedParagraphs[idx] || '';
    return `${orig}\n[${trans}]`;
  }).join('\n\n');

  return combined;
}

/**
 * Create a placeholder text when all APIs fail
 * @param {string} text - Original text
 * @param {string} targetLanguage - Target language
 * @param {string} cefrLevel - CEFR level
 * @returns {string} - Placeholder text with helpful message
 */
export function createPlaceholder(text, targetLanguage, cefrLevel) {
  const message = `[Translation service temporarily unavailable]

Note: We're currently unable to translate this text to ${targetLanguage} at ${cefrLevel} level.
Please check your internet connection or try again later.

Original text:
${text}`;

  return message;
}

export default {
  simplifyForLevel,
  combineOriginalAndTranslation,
  createPlaceholder,
};
