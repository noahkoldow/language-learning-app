// Library Page Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextLibrary from '../components/Library/TextLibrary';
import PdfUpload from '../components/Library/PdfUpload';
import { Button } from '../components/UI/Button';
import { useAuthContext } from '../context/AuthContext';

export function Library() {
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const [activeTab, setActiveTab] = useState('library');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Language Learning App</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'library'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Text Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload PDF
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'library' ? <TextLibrary /> : <PdfUpload />}
      </main>
    </div>
  );
}

export default Library;
