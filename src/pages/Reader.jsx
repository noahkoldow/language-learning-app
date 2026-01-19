// Reader Page Component
import { useNavigate } from 'react-router-dom';
import { useReaderContext } from '../context/ReaderContext';
import PageView from '../components/Reader/PageView';
import LevelIndicator from '../components/Reader/LevelIndicator';
import { Button } from '../components/UI/Button';

export function Reader() {
  const navigate = useNavigate();
  const { currentText, currentPage, nextPage, previousPage, totalPages } = useReaderContext();

  if (!currentText) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Text Loaded</h2>
          <p className="text-gray-600 mb-6">Please select a text from the library</p>
          <Button onClick={() => navigate('/library')}>
            Go to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/library')}
            >
              ← Back to Library
            </Button>
            
            <div className="flex items-center gap-4">
              <LevelIndicator />
              <span className="text-sm text-gray-600">
                {currentText.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PageView />

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="secondary"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            ← Previous
          </Button>

          <div className="text-sm text-gray-600">
            Use gestures:
            <span className="ml-2">← Swipe → to navigate</span>
          </div>

          <Button
            variant="secondary"
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
          >
            Next →
          </Button>
        </div>

        {/* Gesture Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Touch Gestures:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Tap & Hold:</strong> Simplify text by 1 CEFR level</li>
            <li>• <strong>Double-Tap & Hold:</strong> Simplify text by 2 CEFR levels</li>
            <li>• <strong>Tap on Word:</strong> Translate word to your native language</li>
            <li>• <strong>Swipe Left/Right:</strong> Navigate between pages</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Reader;
