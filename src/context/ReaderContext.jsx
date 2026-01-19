// Reader Context Provider
import { createContext, useContext, useState, useCallback } from 'react';
import { splitTextIntoPages } from '../utils/textProcessing';
import { getLanguageCode } from '../utils/languages';

const ReaderContext = createContext(null);

// Helper functions for localStorage
const STORAGE_KEY_PREFIX = 'text_language_';

const saveTextLanguageToStorage = (textId, languageCode) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${textId}`, languageCode);
  } catch (error) {
    console.error('Failed to save text language to localStorage:', error);
  }
};

const getTextLanguageFromStorage = (textId) => {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${textId}`);
  } catch (error) {
    console.error('Failed to get text language from localStorage:', error);
    return null;
  }
};

export function ReaderProvider({ children }) {
  const [currentText, setCurrentText] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('B2');
  const [pages, setPages] = useState([]);
  const [translatedPages, setTranslatedPages] = useState(new Map());
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('German');
  const [textLanguagePreferences, setTextLanguagePreferences] = useState({});

  const loadText = useCallback((text, metadata = {}) => {
    const textPages = splitTextIntoPages(text);
    setPages(textPages);
    setCurrentText({
      content: text,
      ...metadata,
    });
    setCurrentPage(0);
    setTranslatedPages(new Map());
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
  }, [pages.length]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  const goToPage = useCallback((pageNumber) => {
    if (pageNumber >= 0 && pageNumber < pages.length) {
      setCurrentPage(pageNumber);
    }
  }, [pages.length]);

  const cacheTranslatedPage = useCallback((pageNumber, level, translatedText) => {
    const key = `${pageNumber}_${level}`;
    setTranslatedPages(prev => new Map(prev).set(key, translatedText));
  }, []);

  const getTranslatedPage = useCallback((pageNumber, level) => {
    const key = `${pageNumber}_${level}`;
    return translatedPages.get(key);
  }, [translatedPages]);

  const updateLevel = useCallback((newLevel) => {
    setCurrentLevel(newLevel);
  }, []);

  const clearReader = useCallback(() => {
    setCurrentText(null);
    setCurrentPage(0);
    setPages([]);
    setTranslatedPages(new Map());
  }, []);

  // Get the target language for a specific text
  const getTextTargetLanguage = useCallback((textId) => {
    // First check in-memory preferences
    if (textLanguagePreferences[textId]) {
      return textLanguagePreferences[textId];
    }
    
    // Then check localStorage
    const storedLanguage = getTextLanguageFromStorage(textId);
    if (storedLanguage) {
      return storedLanguage;
    }
    
    // Default to the global target language
    // Convert language name to code if needed
    const defaultCode = getLanguageCode(targetLanguage);
    return defaultCode || 'en';
  }, [textLanguagePreferences, targetLanguage]);

  // Update the target language for a specific text
  const updateTextTargetLanguage = useCallback((textId, languageCode) => {
    // Save to in-memory state
    setTextLanguagePreferences(prev => ({
      ...prev,
      [textId]: languageCode,
    }));
    
    // Save to localStorage as fallback
    saveTextLanguageToStorage(textId, languageCode);
  }, []);

  const value = {
    currentText,
    currentPage,
    currentLevel,
    pages,
    targetLanguage,
    nativeLanguage,
    totalPages: pages.length,
    textLanguagePreferences,
    loadText,
    nextPage,
    previousPage,
    goToPage,
    cacheTranslatedPage,
    getTranslatedPage,
    updateLevel,
    setTargetLanguage,
    setNativeLanguage,
    clearReader,
    getTextTargetLanguage,
    updateTextTargetLanguage,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReaderContext() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReaderContext must be used within ReaderProvider');
  }
  return context;
}

export default ReaderContext;
