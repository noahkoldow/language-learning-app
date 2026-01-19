// Translation Hook using Gemini API
import { useState, useCallback } from 'react';
import { translateWithStructure, translateWord, simplifyText } from '../services/gemini';

/**
 * Hook for managing translations
 * @returns {object} - Translation functions and state
 */
export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());

  const translate = useCallback(async (text, targetLanguage, cefrLevel, sourceLanguage) => {
    const cacheKey = `${text}_${targetLanguage}_${cefrLevel}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translatedText = await translateWithStructure(
        text,
        targetLanguage,
        cefrLevel,
        sourceLanguage
      );
      
      // Update cache
      setCache(prev => new Map(prev).set(cacheKey, translatedText));
      
      return translatedText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, [cache]);

  const translateSingleWord = useCallback(async (word, targetLanguage, context) => {
    const cacheKey = `word_${word}_${targetLanguage}_${context}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translation = await translateWord(word, targetLanguage, context);
      
      setCache(prev => new Map(prev).set(cacheKey, translation));
      
      return translation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, [cache]);

  const simplify = useCallback(async (text, language, targetLevel) => {
    const cacheKey = `simplify_${text}_${language}_${targetLevel}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    setIsTranslating(true);
    setError(null);

    try {
      const simplifiedText = await simplifyText(text, language, targetLevel);
      
      setCache(prev => new Map(prev).set(cacheKey, simplifiedText));
      
      return simplifiedText;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    translate,
    translateSingleWord,
    simplify,
    isTranslating,
    error,
    clearCache,
    cacheSize: cache.size,
  };
}

export default useTranslation;
