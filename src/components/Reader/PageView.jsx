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
  
  const { simplify, isTranslating } = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const [wordPopup, setWordPopup] = useState(null);

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
      } catch (error) {
        console.error('Simplification error:', error);
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
      } catch (error) {
        console.error('Simplification error:', error);
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
