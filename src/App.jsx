import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReaderProvider } from './context/ReaderContext';
import AuthGuard from './components/Auth/AuthGuard';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Reader from './pages/Reader';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ReaderProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/library"
              element={
                <AuthGuard>
                  <Library />
                </AuthGuard>
              }
            />
            <Route
              path="/reader"
              element={
                <AuthGuard>
                  <Reader />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="/onboarding"
              element={
                <AuthGuard>
                  <Onboarding />
                </AuthGuard>
              }
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReaderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
