// Profile Page Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useReaderContext } from '../context/ReaderContext';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { CEFR_LEVELS } from '../utils/cefrLevels';

export function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { 
    nativeLanguage, 
    targetLanguage, 
    currentLevel, 
    setNativeLanguage, 
    setTargetLanguage,
    updateLevel,
  } = useReaderContext();

  const [isEditing, setIsEditing] = useState(false);
  const [tempNative, setTempNative] = useState(nativeLanguage);
  const [tempTarget, setTempTarget] = useState(targetLanguage);
  const [tempLevel, setTempLevel] = useState(currentLevel);

  const handleSave = () => {
    setNativeLanguage(tempNative);
    setTargetLanguage(tempTarget);
    updateLevel(tempLevel);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Profile</h1>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/library')}
            >
              ← Back to Library
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Account Info */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user?.email || 'Not signed in'}</p>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Language Settings</h2>
            {!isEditing ? (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Native Language
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempNative}
                  onChange={(e) => setTempNative(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{nativeLanguage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Language (Learning)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-gray-900">{targetLanguage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current CEFR Level
              </label>
              {isEditing ? (
                <select
                  value={tempLevel}
                  onChange={(e) => setTempLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {Object.values(CEFR_LEVELS).map((level) => (
                    <option key={level.code} value={level.code}>
                      {level.code} - {level.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">
                  {currentLevel} - {CEFR_LEVELS[currentLevel]?.name}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-600 mb-4">
            Language Learning App helps you learn languages through reading with AI-powered
            translations that preserve sentence structure.
          </p>
          <p className="text-sm text-gray-500">Version 1.0.0</p>
        </Card>

        {/* Sign Out */}
        <div className="text-center">
          <Button variant="danger" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Profile;
