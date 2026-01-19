// Welcome Screen Component
import { Card } from '../UI/Card';

export function Welcome() {
  return (
    <Card className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Language Learning App
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Learn languages through reading with AI-powered translations and adaptive difficulty levels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="font-semibold mb-2">Read Authentic Texts</h3>
          <p className="text-sm text-gray-600">
            Upload PDFs or choose from our library
          </p>
        </div>

        <div className="p-4">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-semibold mb-2">Adaptive Difficulty</h3>
          <p className="text-sm text-gray-600">
            Adjust text complexity with simple gestures
          </p>
        </div>

        <div className="p-4">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="font-semibold mb-2">Structure-Preserving Translation</h3>
          <p className="text-sm text-gray-600">
            Compare original and translated text side by side
          </p>
        </div>
      </div>
    </Card>
  );
}

export default Welcome;
