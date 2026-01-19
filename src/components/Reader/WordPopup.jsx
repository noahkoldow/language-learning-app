// Word Translation Popup Component
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useReaderContext } from '../../context/ReaderContext';
import { Loading } from '../UI/Loading';

export function WordPopup({ word, x, y, onClose }) {
  const { translateSingleWord, isTranslating } = useTranslation();
  const { nativeLanguage } = useReaderContext();
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTranslation() {
      try {
        const result = await translateSingleWord(word, nativeLanguage);
        setTranslation(result);
      } catch (err) {
        setError('Translation failed');
      }
    }

    fetchTranslation();
  }, [word, nativeLanguage, translateSingleWord]);

  // Close on backdrop click
  useEffect(() => {
    const handleClick = () => onClose();
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Popup */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-xs"
        style={{
          left: `${x}px`,
          top: `${y - 10}px`,
          transform: 'translate(-50%, -100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm">
          <div className="font-semibold text-primary-600 mb-2">{word}</div>
          
          {isTranslating ? (
            <Loading size="sm" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="text-gray-700">{translation}</div>
          )}
        </div>
        
        {/* Arrow pointing down */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 top-full"
          style={{ marginTop: '-1px' }}
        >
          <div className="w-3 h-3 bg-white rotate-45 shadow-md"></div>
        </div>
      </div>
    </>
  );
}

export default WordPopup;
