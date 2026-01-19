// Google Gemini API Service for structure-preserving translation
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
let model;

// Only initialize if API key is available
if (API_KEY && API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    // Silent failure - will use fallback services
    model = null;
  }
}

/**
 * Translate text with structure preservation
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} cefrLevel - CEFR level (A1, A2, B1, B2, C1, C2)
 * @param {string} sourceLanguage - Source language (optional)
 * @returns {Promise<string>} - Translated text
 */
export async function translateWithStructure(
  text,
  targetLanguage,
  cefrLevel = 'B2',
  sourceLanguage = 'auto'
) {
  if (!model) {
    throw new Error('Gemini API not available');
  }

  const prompt = `You are a language learning assistant. Translate the following text to ${targetLanguage} at CEFR level ${cefrLevel}.

CRITICAL REQUIREMENTS:
1. Maintain the EXACT sentence structure of the original text
2. Each sentence in the original must correspond to exactly one sentence in the translation
3. Keep word order as close as possible to the original for structural comparison
4. Only adjust vocabulary complexity to match the ${cefrLevel} level
5. Preserve paragraph breaks and formatting
6. Do NOT add explanations, only provide the translation

${sourceLanguage !== 'auto' ? `Source language: ${sourceLanguage}` : ''}

Text to translate:
${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Gemini translation failed: ${error.message}`);
  }
}

/**
 * Translate a single word with context
 * @param {string} word - Word to translate
 * @param {string} targetLanguage - Target language
 * @param {string} context - Sentence context
 * @returns {Promise<string>} - Translated word with brief explanation
 */
export async function translateWord(word, targetLanguage, context = '') {
  if (!model) {
    throw new Error('Gemini API not available');
  }

  const prompt = `Translate the word "${word}" to ${targetLanguage}.
${context ? `Context: "${context}"` : ''}

Provide:
1. The translation
2. A brief explanation (1 sentence) if helpful for understanding

Format: [translation] - [brief explanation if needed]
Example: "casa - house, home"

Keep it concise.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Gemini word translation failed: ${error.message}`);
  }
}

/**
 * Simplify text by reducing CEFR level
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @param {string} targetLevel - Target CEFR level
 * @returns {Promise<string>} - Simplified text
 */
export async function simplifyText(text, language, targetLevel) {
  if (!model) {
    throw new Error('Gemini API not available');
  }

  const prompt = `You are a language learning assistant. Simplify the following ${language} text to CEFR level ${targetLevel}.

CRITICAL REQUIREMENTS:
1. Maintain the EXACT sentence structure and count
2. Each sentence must remain one sentence
3. Keep the same word order as much as possible
4. Only replace complex vocabulary with simpler alternatives
5. Preserve all paragraph breaks
6. Do NOT add explanations

Text to simplify:
${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Gemini simplification failed: ${error.message}`);
  }
}

export default {
  translateWithStructure,
  translateWord,
  simplifyText,
};
