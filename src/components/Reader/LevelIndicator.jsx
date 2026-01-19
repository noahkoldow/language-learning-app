// CEFR Level Indicator Component
import { useReaderContext } from '../../context/ReaderContext';
import { getLevelInfo } from '../../utils/cefrLevels';

export function LevelIndicator() {
  const { currentLevel } = useReaderContext();
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

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 ${levelColors[currentLevel]}`}>
      <span className="font-semibold text-sm">{levelInfo.code}</span>
      <span className="ml-2 text-xs">{levelInfo.name}</span>
    </div>
  );
}

export default LevelIndicator;
