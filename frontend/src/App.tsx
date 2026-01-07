import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import MyStories from './pages/MyStories';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

/**
 * Ana uygulama bileşeni
 * Routing yapılandırması ve context provider'ları yönetir
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<StoryDetail />} />

            {/* Protected routes - Giriş yapmış kullanıcılar */}
            <Route
              path="/my-stories"
              element={
                <ProtectedRoute>
                  <MyStories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-story"
              element={
                <ProtectedRoute>
                  <CreateStory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-story/:id"
              element={
                <ProtectedRoute>
                  <EditStory />
                </ProtectedRoute>
              }
            />

            {/* Admin routes - Sadece Admin ve SuperAdmin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

