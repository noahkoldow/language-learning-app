// CEFR Level Indicator Component with API Status
import { useReaderContext } from '../../context/ReaderContext';
import { getLevelInfo } from '../../utils/cefrLevels';
import { useTranslation } from '../../hooks/useTranslation';

export function LevelIndicator() {
  const { currentLevel } = useReaderContext();
  const { currentProvider, API_PROVIDERS } = useTranslation();
  const levelInfo = getLevelInfo(currentLevel);

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
      <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 ${levelColors[currentLevel]}`}>
        <span className="font-semibold text-sm">{levelInfo.code}</span>
        <span className="ml-2 text-xs">{levelInfo.name}</span>
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
