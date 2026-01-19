// Translation Hook with Fallback Support
import { useState, useCallback } from 'react';
import { 
  translateWithFallback, 
  translateWordWithFallback, 
  simplifyWithFallback,
  API_PROVIDERS,
} from '../services/translation';

/**
 * Hook for managing translations
 * @returns {object} - Translation functions and state
 */
export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());
  const [currentProvider, setCurrentProvider] = useState(API_PROVIDERS.GEMINI);

  const translate = useCallback(async (text, targetLanguage, cefrLevel, sourceLanguage) => {
    const cacheKey = `${text}_${targetLanguage}_${cefrLevel}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      setCurrentProvider(cached.provider);
      return cached.text;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateWithFallback(
        text,
        targetLanguage,
        cefrLevel,
        sourceLanguage
      );
      
      // Update cache with provider info
      setCache(prev => new Map(prev).set(cacheKey, result));
      setCurrentProvider(result.provider);
      
      return result.text;
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
      const cached = cache.get(cacheKey);
      setCurrentProvider(cached.provider);
      return cached.text;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateWordWithFallback(word, targetLanguage, context);
      
      setCache(prev => new Map(prev).set(cacheKey, result));
      setCurrentProvider(result.provider);
      
      return result.text;
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
      const cached = cache.get(cacheKey);
      setCurrentProvider(cached.provider);
      return cached.text;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await simplifyWithFallback(text, language, targetLevel);
      
      setCache(prev => new Map(prev).set(cacheKey, result));
      setCurrentProvider(result.provider);
      
      return result.text;
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
    currentProvider,
    API_PROVIDERS,
  };
}

export default useTranslation;
