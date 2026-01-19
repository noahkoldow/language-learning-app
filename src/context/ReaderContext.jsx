// Reader Context Provider
import { createContext, useContext, useState, useCallback } from 'react';
import { splitTextIntoPages } from '../utils/textProcessing';

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  const [currentText, setCurrentText] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('B2');
  const [baseLevel, setBaseLevel] = useState('B2'); // Base level set by user
  const [pages, setPages] = useState([]);
  const [translatedPages, setTranslatedPages] = useState(new Map());
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('German');

  const loadText = useCallback((text, metadata = {}) => {
    let textPages;
    
    // Check if text is already an array of pages or needs to be split
    if (Array.isArray(text)) {
      // Text is already split into pages
      textPages = text;
      console.log('Loading text with pre-split pages:', textPages.length);
    } else {
      // Text needs to be split
      textPages = splitTextIntoPages(text);
      console.log('Loading text and splitting into pages:', textPages.length);
    }
    
    setPages(textPages);
    setCurrentText({
      content: Array.isArray(text) ? text.join('\n\n') : text,
      ...metadata,
    });
    setCurrentPage(0);
    setTranslatedPages(new Map());
    
    console.log('Text loaded:', {
      title: metadata.title,
      language: metadata.language,
      targetLanguage: metadata.targetLanguage,
      totalPages: textPages.length,
    });
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

  const updateBaseLevel = useCallback((newLevel) => {
    setBaseLevel(newLevel);
    setCurrentLevel(newLevel);
  }, []);

  const clearReader = useCallback(() => {
    setCurrentText(null);
    setCurrentPage(0);
    setPages([]);
    setTranslatedPages(new Map());
    setCurrentLevel(baseLevel); // Reset to base level
  }, [baseLevel]);

  // Language preference management per text
  const getTextTargetLanguage = useCallback((textId) => {
    const stored = localStorage.getItem(`textLanguagePrefs_${textId}`);
    if (stored) {
      return stored;
    }
    // Default to targetLanguage context or 'de'
    const langMap = {
      'german': 'de',
      'english': 'en',
      'french': 'fr',
      'spanish': 'es',
      'italian': 'it',
      'portuguese': 'pt',
      'dutch': 'nl',
      'polish': 'pl'
    };
    const targetLower = targetLanguage.toLowerCase();
    for (const [name, code] of Object.entries(langMap)) {
      if (targetLower.startsWith(name)) {
        return code;
      }
    }
    return 'de';
  }, [targetLanguage]);

  const setTextTargetLanguage = useCallback((textId, languageCode) => {
    localStorage.setItem(`textLanguagePrefs_${textId}`, languageCode);
  }, []);

  const value = {
    currentText,
    currentPage,
    currentLevel,
    baseLevel,
    pages,
    targetLanguage,
    nativeLanguage,
    totalPages: pages.length,
    loadText,
    nextPage,
    previousPage,
    goToPage,
    cacheTranslatedPage,
    getTranslatedPage,
    updateLevel,
    updateBaseLevel,
    setTargetLanguage,
    setNativeLanguage,
    clearReader,
    getTextTargetLanguage,
    setTextTargetLanguage,
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
