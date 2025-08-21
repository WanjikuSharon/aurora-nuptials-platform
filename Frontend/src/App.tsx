import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserProfile, selectIsAuthenticated, selectCurrentUser } from './store/slices/authSlice';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';

// Auth Components
import ProtectedRoute, { CoupleRoute, VendorRoute, AdminRoute } from './components/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/couple/Dashboard';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  // Fetch user profile on app load if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes - Couple */}
            <Route path="/couple/dashboard" element={
              <CoupleRoute>
                <Dashboard />
              </CoupleRoute>
            } />
            
            {/* Protected Routes - Vendor */}
            <Route path="/vendor/dashboard" element={
              <VendorRoute>
                <div className="min-h-screen gradient-bg flex items-center justify-center">
                  <div className="card text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                      Vendor Dashboard
                    </h2>
                    <p className="text-gray-600">
                      Welcome to your vendor dashboard! This feature is coming soon.
                    </p>
                  </div>
                </div>
              </VendorRoute>
            } />
            
            {/* Protected Routes - Admin */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <div className="min-h-screen gradient-bg flex items-center justify-center">
                  <div className="card text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                      Admin Dashboard
                    </h2>
                    <p className="text-gray-600">
                      Welcome to the admin dashboard! This feature is coming soon.
                    </p>
                  </div>
                </div>
              </AdminRoute>
            } />
            
            {/* Placeholder Routes */}
            <Route path="/venues" element={
              <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="card text-center">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    Venues
                  </h2>
                  <p className="text-gray-600">
                    Browse beautiful wedding venues. This feature is coming soon!
                  </p>
                </div>
              </div>
            } />
            
            <Route path="/vendors" element={
              <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="card text-center">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    Vendors
                  </h2>
                  <p className="text-gray-600">
                    Connect with trusted wedding vendors. This feature is coming soon!
                  </p>
                </div>
              </div>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen gradient-bg flex items-center justify-center">
                  <div className="card text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                      Profile Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your profile settings. This feature is coming soon!
                    </p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;