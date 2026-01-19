// Home Page Component
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { useAuthContext } from '../context/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-primary-600">Language Learning App</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/library">
                  <Button variant="secondary">Library</Button>
                </Link>
                <Link to="/profile">
                  <Button>Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Learn Languages<br />Through Reading
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload PDFs or read from our library with AI-powered translations
            that preserve sentence structure for better learning.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={isAuthenticated ? '/library' : '/register'}>
              <Button size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">Learn More</Button>
            </a>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👆</div>
            <h3 className="text-xl font-semibold mb-3">Touch Gestures</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Tap & hold: Simplify by 1 level</li>
              <li>• Double-tap & hold: Simplify by 2 levels</li>
              <li>• Tap word: Translate instantly</li>
              <li>• Swipe: Navigate pages</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">CEFR Levels</h3>
            <p className="text-gray-600 text-sm">
              Adaptive difficulty based on European language standards (A1-C2).
              Start at your level and progress naturally.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Google Gemini ensures translations maintain original sentence
              structure for better comprehension and learning.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold mb-2">Upload or Choose</h4>
              <p className="text-sm text-gray-600">
                Upload a PDF or select from our library
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold mb-2">Set Your Level</h4>
              <p className="text-sm text-gray-600">
                Choose your CEFR proficiency level
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold mb-2">Read & Learn</h4>
              <p className="text-sm text-gray-600">
                Use gestures to adjust difficulty on the fly
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">
                Monitor your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of language learners today
          </p>
          <Link to={isAuthenticated ? '/library' : '/register'}>
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
