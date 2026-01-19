// Onboarding Flow Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReaderContext } from '../context/ReaderContext';
import Welcome from '../components/Onboarding/Welcome';
import LanguageSelect from '../components/Onboarding/LanguageSelect';
import LevelAssessment from '../components/Onboarding/LevelAssessment';

export function Onboarding() {
  const navigate = useNavigate();
  const { setNativeLanguage, setTargetLanguage, updateLevel } = useReaderContext();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  const handleWelcomeNext = () => {
    setStep(2);
  };

  const handleLanguageNext = (data) => {
    setUserData({ ...userData, ...data });
    setStep(3);
  };

  const handleLevelComplete = (data) => {
    const finalData = { ...userData, ...data };
    
    // Save to context
    setNativeLanguage(finalData.nativeLanguage);
    setTargetLanguage(finalData.targetLanguage);
    updateLevel(finalData.level);
    
    // Navigate to library
    navigate('/library');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-primary-600'
                    : s < step
                    ? 'w-2 bg-primary-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {step} of 3
          </p>
        </div>

        {/* Step Content */}
        {step === 1 && <Welcome onNext={handleWelcomeNext} />}
        {step === 2 && (
          <LanguageSelect
            onNext={handleLanguageNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <LevelAssessment
            onNext={handleLevelComplete}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}

export default Onboarding;
