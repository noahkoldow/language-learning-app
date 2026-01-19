// CEFR Level Indicator Component with API Status and Dropdown
import { useState, useRef, useEffect } from 'react';
import { useReaderContext } from '../../context/ReaderContext';
import { getLevelInfo, CEFR_LEVEL_CODES } from '../../utils/cefrLevels';
import { useTranslation } from '../../hooks/useTranslation';

export function LevelIndicator() {
  const { currentLevel, updateLevel, currentText } = useReaderContext();
  const { currentProvider, API_PROVIDERS } = useTranslation();
  const levelInfo = getLevelInfo(currentLevel);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the original level of the text (highest available level)
  const originalLevel = currentText?.level || 'C2';
  
  // Get available levels up to the original level
  const originalLevelIndex = CEFR_LEVEL_CODES.indexOf(originalLevel);
  const availableLevels = CEFR_LEVEL_CODES.slice(0, originalLevelIndex + 1);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleLevelSelect = (level) => {
    updateLevel(level);
    setIsDropdownOpen(false);
  };

  if (!levelInfo) return null;

  const levelColors = {
    A1: 'bg-green-100 text-green-800 border-green-300',
    A2: 'bg-green-200 text-green-900 border-green-400',
    B1: 'bg-blue-100 text-blue-800 border-blue-300',
    B2: 'bg-blue-200 text-blue-900 border-blue-400',
    C1: 'bg-purple-100 text-purple-800 border-purple-300',
    C2: 'bg-purple-200 text-purple-900 border-purple-400',
  };

  // API provider icons and colors
  const getProviderBadge = () => {
    switch (currentProvider) {
      case API_PROVIDERS.GEMINI:
        return { icon: '🤖', text: 'AI', color: 'bg-green-500', title: 'Gemini AI' };
      case API_PROVIDERS.LIBRE_TRANSLATE:
        return { icon: '🌐', text: 'LT', color: 'bg-blue-500', title: 'LibreTranslate' };
      case API_PROVIDERS.MYMEMORY:
        return { icon: '💾', text: 'MM', color: 'bg-yellow-500', title: 'MyMemory' };
      case API_PROVIDERS.FALLBACK:
        return { icon: '📖', text: 'Local', color: 'bg-gray-500', title: 'Offline mode' };
      default:
        return null;
    }
  };

  const providerBadge = getProviderBadge();

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`inline-flex items-center px-3 py-1 rounded-full border-2 cursor-pointer hover:opacity-80 transition-opacity ${levelColors[currentLevel]}`}
        >
          <span className="font-semibold text-sm">{levelInfo.code}</span>
          <span className="ml-2 text-xs">{levelInfo.name}</span>
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
            {availableLevels.map((level) => {
              const info = getLevelInfo(level);
              const isSelected = level === currentLevel;
              const isFirst = level === availableLevels[0];
              const isLast = level === availableLevels[availableLevels.length - 1];
              
              // Build className
              const buttonClass = [
                'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors',
                isSelected && 'bg-primary-50 font-semibold',
                isFirst && 'rounded-t-lg',
                isLast && 'rounded-b-lg'
              ].filter(Boolean).join(' ');
              
              return (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={buttonClass}
                >
                  <span className="font-semibold">{info.code}</span>
                  <span className="ml-2 text-sm text-gray-600">{info.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {providerBadge && (
        <div 
          className={`inline-flex items-center px-2 py-1 rounded-full ${providerBadge.color} text-white text-xs font-medium`}
          title={providerBadge.title}
        >
          <span className="mr-1">{providerBadge.icon}</span>
          <span>{providerBadge.text}</span>
        </div>
      )}
    </div>
  );
}

export default LevelIndicator;
