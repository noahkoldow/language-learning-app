// Page View Component with Gesture Support
import { useState, useEffect, useCallback } from 'react';
import { useGestures } from '../../hooks/useGestures';
import { useReaderContext } from '../../context/ReaderContext';
import { useTranslation } from '../../hooks/useTranslation';
import { getLowerLevel } from '../../utils/cefrLevels';
import WordPopup from './WordPopup';
import { Loading } from '../UI/Loading';

export function PageView() {
  const { 
    pages, 
    currentPage, 
    currentLevel,
    currentText,
    baseLevel,
    nextPage, 
    previousPage,
    updateLevel,
    getTranslatedPage,
    cacheTranslatedPage,
  } = useReaderContext();
  
  const { simplify, isTranslating, currentProvider, API_PROVIDERS } = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const [wordPopup, setWordPopup] = useState(null);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  // Helper to show fallback notice
  const showFallbackNotification = () => {
    if (currentProvider !== API_PROVIDERS.GEMINI) {
      setShowFallbackNotice(true);
      setTimeout(() => setShowFallbackNotice(false), 3000);
    }
  };

  // Pre-load current page and next 2 pages at the base level
  const preloadPages = useCallback(async () => {
    if (!currentText?.language || !baseLevel) return;
    
    console.log('Pre-loading pages at base level:', baseLevel);
    setIsPreloading(true);
    
    try {
      // Pre-load current page and next 2 pages (ensure pageNum >= 0 and < pages.length)
      const pagesToLoad = [currentPage, currentPage + 1, currentPage + 2].filter(
        pageNum => pageNum >= 0 && pageNum < pages.length
      );
      
      for (const pageNum of pagesToLoad) {
        // Skip if already cached
        const cached = getTranslatedPage(pageNum, baseLevel);
        if (cached) {
          console.log(`Page ${pageNum} already cached at level ${baseLevel}`);
          continue;
        }
        
        // Only pre-load if base level is different from original
        if (baseLevel !== currentText.level) {
          try {
            console.log(`Pre-loading page ${pageNum} at level ${baseLevel}`);
            const simplified = await simplify(pages[pageNum], currentText.language, baseLevel);
            cacheTranslatedPage(pageNum, baseLevel, simplified);
            console.log(`Successfully pre-loaded page ${pageNum}`);
          } catch (error) {
            console.warn(`Failed to pre-load page ${pageNum}:`, error.message);
            // Continue with other pages even if one fails
          }
        }
      }
    } finally {
      setIsPreloading(false);
    }
  }, [currentPage, currentText, baseLevel, pages, getTranslatedPage, cacheTranslatedPage, simplify]);

  // Pre-load pages when text loads, page changes, or base level changes
  useEffect(() => {
    if (pages.length > 0 && currentText) {
      preloadPages();
    }
  }, [currentPage, baseLevel, pages.length, currentText, preloadPages]);

  useEffect(() => {
    // Load current page
    if (pages[currentPage]) {
      const loadPage = () => {
        const cached = getTranslatedPage(currentPage, currentLevel);
        if (cached) {
          console.log('Loading cached translation for page:', currentPage, 'level:', currentLevel);
          setDisplayText(cached);
        } else {
          console.log('Loading original text for page:', currentPage);
          setDisplayText(pages[currentPage]);
        }
      };
      loadPage();
    }
  }, [currentPage, currentLevel, pages, getTranslatedPage]);

  const handleLongPress = async (e) => {
    e.preventDefault();
    const newLevel = getLowerLevel(currentLevel, 1);
    
    console.log('Long press detected - Simplifying by 1 level');
    console.log('Current page:', currentPage);
    console.log('Current level:', currentLevel);
    console.log('Target level:', newLevel);
    console.log('Source language:', currentText?.language);
    
    if (newLevel && pages[currentPage] && currentText?.language) {
      try {
        console.log('Calling simplify API...');
        const simplified = await simplify(pages[currentPage], currentText.language, newLevel);
        console.log('API response received:', simplified.substring(0, 50) + '...');
        setDisplayText(simplified);
        cacheTranslatedPage(currentPage, newLevel, simplified);
        updateLevel(newLevel);
        showFallbackNotification();
      } catch (error) {
        console.error('Simplification error:', error);
        // Don't show error to user, fallback should have been applied
      }
    }
  };

  const handleDoubleTapLongPress = async (e) => {
    e.preventDefault();
    const newLevel = getLowerLevel(currentLevel, 2);
    
    console.log('Double tap & hold detected - Simplifying by 2 levels');
    console.log('Current page:', currentPage);
    console.log('Current level:', currentLevel);
    console.log('Target level:', newLevel);
    console.log('Source language:', currentText?.language);
    
    if (newLevel && pages[currentPage] && currentText?.language) {
      try {
        console.log('Calling simplify API...');
        const simplified = await simplify(pages[currentPage], currentText.language, newLevel);
        console.log('API response received:', simplified.substring(0, 50) + '...');
        setDisplayText(simplified);
        cacheTranslatedPage(currentPage, newLevel, simplified);
        updateLevel(newLevel);
        showFallbackNotification();
      } catch (error) {
        console.error('Simplification error:', error);
        // Don't show error to user, fallback should have been applied
      }
    }
  };

  const handleWordTap = (e, range) => {
    e.preventDefault();
    
    // Extract word from range
    const word = range.toString().trim();
    if (word) {
      const rect = range.getBoundingClientRect();
      setWordPopup({
        word,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  };

  const gestureHandlers = useGestures({
    onLongPress: handleLongPress,
    onDoubleTapLongPress: handleDoubleTapLongPress,
    onSwipeLeft: nextPage,
    onSwipeRight: previousPage,
    onWordTap: handleWordTap,
  });

  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No text loaded</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Pre-loading indicator */}
      {isPreloading && (
        <div className="fixed top-4 left-4 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow-lg animate-fade-in">
          <div className="flex items-center text-sm">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Pre-loading pages...</span>
          </div>
        </div>
      )}
      
      {/* Fallback Notice Toast */}
      {showFallbackNotice && (
        <div className="fixed top-4 right-4 z-50 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded shadow-lg animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Using alternative translation service
              {currentProvider === API_PROVIDERS.LIBRE_TRANSLATE && ' (LibreTranslate)'}
              {currentProvider === API_PROVIDERS.MYMEMORY && ' (MyMemory)'}
              {currentProvider === API_PROVIDERS.FALLBACK && ' (offline mode)'}
            </span>
          </div>
        </div>
      )}
      
      <div
        className="reader-page gesture-area min-h-[60vh] select-none touch-none bg-white rounded-lg shadow-md p-6 sm:p-8"
        {...gestureHandlers}
      >
        {isTranslating ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <Loading text="Processing..." />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            {displayText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 leading-relaxed text-gray-800">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      {wordPopup && (
        <WordPopup
          word={wordPopup.word}
          x={wordPopup.x}
          y={wordPopup.y}
          onClose={() => setWordPopup(null)}
        />
      )}
      
      {/* Page indicator */}
      <div className="text-center mt-4 text-sm text-gray-600">
        Page {currentPage + 1} of {pages.length}
      </div>
    </div>
  );
}

export default PageView;
