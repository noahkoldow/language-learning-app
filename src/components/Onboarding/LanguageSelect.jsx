// Language Selection Component
import { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
];

export function LanguageSelect({ onNext, onBack }) {
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const handleNext = () => {
    if (nativeLanguage && targetLanguage && nativeLanguage !== targetLanguage) {
      onNext({ nativeLanguage, targetLanguage });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Select Your Languages
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Your Native Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={`native-${lang.code}`}
                onClick={() => setNativeLanguage(lang.name)}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  nativeLanguage === lang.name
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Language You Want to Learn
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={`target-${lang.code}`}
                onClick={() => setTargetLanguage(lang.name)}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  targetLanguage === lang.name
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${nativeLanguage === lang.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={nativeLanguage === lang.name}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {nativeLanguage && targetLanguage && nativeLanguage === targetLanguage && (
          <p className="text-sm text-red-600 text-center">
            Please select different languages for native and target.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!nativeLanguage || !targetLanguage || nativeLanguage === targetLanguage}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}

export default LanguageSelect;
