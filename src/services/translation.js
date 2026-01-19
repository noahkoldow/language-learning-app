// Main Translation Service with Fallback Chain
// Orchestrates translation attempts across multiple services:
// Gemini API -> LibreTranslate -> MyMemory -> Rule-based fallback

import { translateWithStructure as geminiTranslate, translateWord as geminiTranslateWord, simplifyText as geminiSimplify } from './gemini';
import { translateWithLibre } from './libreTranslate';
import { translateWithMyMemory } from './myMemory';
import { simplifyForLevel, createPlaceholder } from './simplifier';

// Track which API is currently being used
export const API_PROVIDERS = {
  GEMINI: 'gemini',
  LIBRE_TRANSLATE: 'libretranslate',
  MYMEMORY: 'mymemory',
  FALLBACK: 'fallback',
};

let currentProvider = API_PROVIDERS.GEMINI;
let lastError = null;

/**
 * Get the currently active API provider
 * @returns {string} - Current provider name
 */
export function getCurrentProvider() {
  return currentProvider;
}

/**
 * Get the last error that occurred
 * @returns {string|null} - Error message or null
 */
export function getLastError() {
  return lastError;
}

/**
 * Translate text with structure preservation using fallback chain
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} cefrLevel - CEFR level (A1, A2, B1, B2, C1, C2)
 * @param {string} sourceLanguage - Source language (optional)
 * @returns {Promise<{text: string, provider: string}>} - Translated text and provider used
 */
export async function translateWithFallback(
  text,
  targetLanguage,
  cefrLevel = 'B2',
  sourceLanguage = 'auto'
) {
  lastError = null;

  // Try Gemini API first
  try {
    const result = await geminiTranslate(text, targetLanguage, cefrLevel, sourceLanguage);
    currentProvider = API_PROVIDERS.GEMINI;
    return { text: result, provider: currentProvider };
  } catch (error) {
    console.warn('Gemini translation failed:', error.message);
    lastError = error.message;
  }

  // Try LibreTranslate
  try {
    const result = await translateWithLibre(text, sourceLanguage === 'auto' ? 'en' : sourceLanguage, targetLanguage);
    // Apply rule-based simplification
    const simplified = simplifyForLevel(result, targetLanguage, cefrLevel);
    currentProvider = API_PROVIDERS.LIBRE_TRANSLATE;
    return { text: simplified, provider: currentProvider };
  } catch (error) {
    console.warn('LibreTranslate failed:', error.message);
    lastError = error.message;
  }

  // Try MyMemory
  try {
    const result = await translateWithMyMemory(text, sourceLanguage === 'auto' ? 'en' : sourceLanguage, targetLanguage);
    // Apply rule-based simplification
    const simplified = simplifyForLevel(result, targetLanguage, cefrLevel);
    currentProvider = API_PROVIDERS.MYMEMORY;
    return { text: simplified, provider: currentProvider };
  } catch (error) {
    console.warn('MyMemory translation failed:', error.message);
    lastError = error.message;
  }

  // All APIs failed - use placeholder
  const placeholder = createPlaceholder(text, targetLanguage, cefrLevel);
  currentProvider = API_PROVIDERS.FALLBACK;
  return { text: placeholder, provider: currentProvider };
}

/**
 * Translate a single word with context using fallback chain
 * @param {string} word - Word to translate
 * @param {string} targetLanguage - Target language
 * @param {string} context - Sentence context
 * @returns {Promise<{text: string, provider: string}>} - Translated word and provider used
 */
export async function translateWordWithFallback(word, targetLanguage, context = '') {
  lastError = null;

  // Try Gemini API first
  try {
    const result = await geminiTranslateWord(word, targetLanguage, context);
    currentProvider = API_PROVIDERS.GEMINI;
    return { text: result, provider: currentProvider };
  } catch (error) {
    console.warn('Gemini word translation failed:', error.message);
    lastError = error.message;
  }

  // Try LibreTranslate for word
  try {
    const result = await translateWithLibre(word, 'auto', targetLanguage);
    currentProvider = API_PROVIDERS.LIBRE_TRANSLATE;
    return { text: `${word} → ${result}`, provider: currentProvider };
  } catch (error) {
    console.warn('LibreTranslate word translation failed:', error.message);
    lastError = error.message;
  }

  // Try MyMemory for word
  try {
    const result = await translateWithMyMemory(word, 'auto', targetLanguage);
    currentProvider = API_PROVIDERS.MYMEMORY;
    return { text: `${word} → ${result}`, provider: currentProvider };
  } catch (error) {
    console.warn('MyMemory word translation failed:', error.message);
    lastError = error.message;
  }

  // All APIs failed - return placeholder
  currentProvider = API_PROVIDERS.FALLBACK;
  return { 
    text: `${word} = [${targetLanguage} translation unavailable]`, 
    provider: currentProvider 
  };
}

/**
 * Simplify text by reducing CEFR level using fallback chain
 * @param {string} text - Text to simplify
 * @param {string} language - Language of the text
 * @param {string} targetLevel - Target CEFR level
 * @returns {Promise<{text: string, provider: string}>} - Simplified text and provider used
 */
export async function simplifyWithFallback(text, language, targetLevel) {
  lastError = null;

  // Try Gemini API first
  try {
    const result = await geminiSimplify(text, language, targetLevel);
    currentProvider = API_PROVIDERS.GEMINI;
    return { text: result, provider: currentProvider };
  } catch (error) {
    console.warn('Gemini simplification failed:', error.message);
    lastError = error.message;
  }

  // Use rule-based simplification as fallback
  try {
    const simplified = simplifyForLevel(text, language, targetLevel);
    currentProvider = API_PROVIDERS.FALLBACK;
    return { text: simplified, provider: currentProvider };
  } catch (error) {
    console.warn('Rule-based simplification failed:', error.message);
    lastError = error.message;
  }

  // If even rule-based fails, return original
  currentProvider = API_PROVIDERS.FALLBACK;
  return { text: text, provider: currentProvider };
}

/**
 * Reset the provider tracking
 */
export function resetProvider() {
  currentProvider = API_PROVIDERS.GEMINI;
  lastError = null;
}

export default {
  translateWithFallback,
  translateWordWithFallback,
  simplifyWithFallback,
  getCurrentProvider,
  getLastError,
  resetProvider,
  API_PROVIDERS,
};
