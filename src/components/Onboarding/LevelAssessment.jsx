// CEFR Level Assessment Component
import { useState } from 'react';
import { Card } from '../UI/Card';
import { CEFR_LEVELS } from '../../utils/cefrLevels';

export function LevelAssessment({ userData, updateUserData }) {
  const [selectedLevel, setSelectedLevel] = useState(userData.level || '');

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    updateUserData({ level });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        What's Your Current Level?
      </h2>
      
      <p className="text-center text-gray-600 mb-8">
        Select your current proficiency level in the target language.
        Don't worry, you can adjust this later!
      </p>

      <div className="space-y-3">
        {Object.values(CEFR_LEVELS).map((level) => (
          <button
            key={level.code}
            onClick={() => handleLevelChange(level.code)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
              selectedLevel === level.code
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-600">
                    {level.code}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {level.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {level.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

export default LevelAssessment;
