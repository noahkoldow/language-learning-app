// Reader Context Provider
import { createContext, useContext, useState, useCallback } from 'react';
import { splitTextIntoPages } from '../utils/textProcessing';

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  const [currentText, setCurrentText] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('B2');
  const [pages, setPages] = useState([]);
  const [translatedPages, setTranslatedPages] = useState(new Map());
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('German');

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

  const value = {
    currentText,
    currentPage,
    currentLevel,
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
    setTargetLanguage,
    setNativeLanguage,
    clearReader,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReaderContext() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReaderContext must be used within ReaderProvider');
  }
  return context;
}

export default ReaderContext;
