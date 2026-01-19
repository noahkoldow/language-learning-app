// Page View Component with Gesture Support
import { useState, useEffect } from 'react';
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
    targetLanguage,
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

  // Helper to show fallback notice
  const showFallbackNotification = () => {
    if (currentProvider !== API_PROVIDERS.GEMINI) {
      setShowFallbackNotice(true);
      setTimeout(() => setShowFallbackNotice(false), 3000);
    }
  };

  useEffect(() => {
    // Load current page
    if (pages[currentPage]) {
      const loadPage = () => {
        const cached = getTranslatedPage(currentPage, currentLevel);
        if (cached) {
          setDisplayText(cached);
        } else {
          setDisplayText(pages[currentPage]);
        }
      };
      loadPage();
    }
  }, [currentPage, currentLevel, pages, getTranslatedPage]);

  const handleLongPress = async (e) => {
    e.preventDefault();
    const newLevel = getLowerLevel(currentLevel, 1);
    
    if (newLevel && pages[currentPage]) {
      try {
        const simplified = await simplify(pages[currentPage], targetLanguage, newLevel);
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
    
    if (newLevel && pages[currentPage]) {
      try {
        const simplified = await simplify(pages[currentPage], targetLanguage, newLevel);
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
