
// In your App.js
import React from 'react';
// Import routing components from the react-router-dom library
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your page and layout components
// Make sure these file paths are correct for your project!
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUp';
import Dashboard from './pages/Dashboard'; // Assuming you moved it to pages
import BusinessProfilePage from './pages/BusinessProfilePage';
import RequestResetPage from './pages/RequestResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ClientVerificationPage from './pages/ClientVerificationPage';
import SecurePaymentPage from './pages/SecurePaymentPage';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * The main application component.
 * This component contains the routing configuration for the application.
 * It renders a BrowserRouter component with a Routes component inside.
 * The Routes component contains Route components for public-facing pages and protected application areas.

 * If the user is not authenticated, the protected application area will redirect the user to the login page.
 */

export default function App() {
  // You need to define this variable inside your component
  // For now, we can hardcode it. Later, it will come from user state.
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public-Facing Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/business-profile" element={<BusinessProfilePage />} />
        <Route path="/forgot-password" element={<RequestResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/ClientVerificationPage" element={<ClientVerificationPage/>}/>
        <Route path="/SecurePaymentPage" element={<SecurePaymentPage/>}/>


        {/* Protected Application Area */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
                <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}