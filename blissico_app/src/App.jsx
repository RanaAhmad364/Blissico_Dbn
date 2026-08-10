import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import your Auth Context
import { AuthProvider } from './context/AuthContext';

// 2. Import your existing Pages
import Home from './pages/Home';
import About from './pages/About';
import Cards from './pages/Cards';
import Occasions from './pages/Occasions';
import Collections from './pages/Collections';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Customize from './pages/Customize';
import ProductDetail from './pages/ProductDetail';

// 3. Import the new Auth Pages
  import Login from './pages/auth/Login';
  import Register from './pages/auth/Register';
  import VerifyOTP from './pages/auth/VerifyOTP';
  import ForgotPassword from './pages/auth/ForgotPassword';
  import ResetPassword from './pages/auth/ResetPassword';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Wrap everything in AuthProvider so all pages know if a user is logged in */}
      <AuthProvider>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/:category/:slug" element={<CategoryPage />} />
          <Route path="/occasions" element={<Occasions />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/product/:id" element={<ProductDetail />} /> 
          <Route path="/customize" element={<Customize />} />

          {/* NEW AUTH ROUTES (Added here) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;