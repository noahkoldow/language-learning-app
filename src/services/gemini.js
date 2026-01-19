// Google Gemini API Service for structure-preserving translation
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
let models = [];

// Model priority list: try newest first, fallback to older models
const MODEL_PRIORITY = [
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-002',
];

// Only initialize if API key is available
if (API_KEY && API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Initialize all models in priority order
    models = MODEL_PRIORITY.map(modelName => ({
      name: modelName,
      instance: genAI.getGenerativeModel({ model: modelName }),
    }));
  } catch {
    // Silent failure - will use fallback services
    models = [];
  }
}

/**
 * Helper function to try API call with multiple model fallbacks
 * @param {Function} apiCall - Function that takes a model and returns a promise
 * @param {string} operationType - Type of operation for error context
 * @returns {Promise<string>} - Result from successful model
 */
async function tryWithModelFallback(apiCall, operationType = 'API call') {
  if (!models || models.length === 0) {
    throw new Error('Gemini API not available');
  }

  let lastError = null;
  
  // Try each model in order
  for (const { name, instance } of models) {
    try {
      console.log(`Trying Gemini model: ${name} for ${operationType}`);
      const result = await apiCall(instance);
      console.log(`Successfully used model: ${name} for ${operationType}`);
      return result;
    } catch (error) {
      console.warn(`Model ${name} failed for ${operationType}:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }
  
  // All models failed
  throw new Error(`Gemini ${operationType} failed: All models failed. Last error: ${lastError?.message}`);
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

  return tryWithModelFallback(async (model) => {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }, 'translation');
}

/**
 * Translate a single word with context
 * @param {string} word - Word to translate
 * @param {string} targetLanguage - Target language
 * @param {string} context - Sentence context
 * @returns {Promise<string>} - Translated word with brief explanation
 */
export async function translateWord(word, targetLanguage, context = '') {
  const prompt = `Translate the word "${word}" to ${targetLanguage}.
${context ? `Context: "${context}"` : ''}

Provide:
1. The translation
2. A brief explanation (1 sentence) if helpful for understanding

Format: [translation] - [brief explanation if needed]
Example: "casa - house, home"

Keep it concise.`;

  return tryWithModelFallback(async (model) => {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }, 'word translation');
}

/**
 * Simplify text by reducing CEFR level
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @param {string} targetLevel - Target CEFR level
 * @returns {Promise<string>} - Simplified text
 */
export async function simplifyText(text, language, targetLevel) {
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

  return tryWithModelFallback(async (model) => {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }, 'simplification');
}

export default {
  translateWithStructure,
  translateWord,
  simplifyText,
};
