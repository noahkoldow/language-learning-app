// Onboarding Flow Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReaderContext } from '../context/ReaderContext';
import { useGestures } from '../hooks/useGestures';
import { Button } from '../components/UI/Button';
import Welcome from '../components/Onboarding/Welcome';
import LanguageSelect from '../components/Onboarding/LanguageSelect';
import LevelAssessment from '../components/Onboarding/LevelAssessment';

export function Onboarding() {
  const navigate = useNavigate();
  const { setNativeLanguage, setTargetLanguage, updateLevel } = useReaderContext();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  const totalSteps = 3;

  // Navigation handlers
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save to context
    if (userData.nativeLanguage) setNativeLanguage(userData.nativeLanguage);
    if (userData.targetLanguage) setTargetLanguage(userData.targetLanguage);
    if (userData.level) updateLevel(userData.level);
    
    // Navigate to library
    navigate('/library');
  };

  // Update user data
  const updateUserData = (data) => {
    setUserData({ ...userData, ...data });
  };

  // Check if current step is valid to proceed
  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) {
      return userData.nativeLanguage && 
             userData.targetLanguage && 
             userData.nativeLanguage !== userData.targetLanguage;
    }
    if (step === 3) {
      return userData.level;
    }
    return false;
  };

  // Swipe gesture handlers
  const gestureHandlers = useGestures({
    onSwipeLeft: () => {
      if (canProceed()) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      handleBack();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" {...gestureHandlers}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator (Dots) */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${
                  s === step
                    ? 'bg-primary-600 scale-125'
                    : s < step
                    ? 'bg-primary-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Schritt {step} von {totalSteps}
          </p>
        </div>

        {/* Step Content */}
        {step === 1 && <Welcome />}
        {step === 2 && (
          <LanguageSelect
            userData={userData}
            updateUserData={updateUserData}
          />
        )}
        {step === 3 && (
          <LevelAssessment
            userData={userData}
            updateUserData={updateUserData}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          {step > 1 ? (
            <Button
              variant="secondary"
              onClick={handleBack}
              size="lg"
              className="min-w-[120px] min-h-[44px]"
            >
              Zurück
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
            className="min-w-[120px] min-h-[44px]"
          >
            {step === totalSteps ? 'Los geht\'s' : 'Weiter'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
