import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ToolPage from '@/pages/ToolPage.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { Toaster } from '@/components/ui/toaster';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageProvider } from '@/lib/i18n.jsx';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Language and Tool Routes */}
      <Route path="/:lang" element={<ToolPage />} />
      <Route path="/:lang/:slug" element={<ToolPage />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Toaster />
        <AppContent />
        <motion.a
          href="https://t.me/spnfury"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Contact via Telegram"
        >
          <MessageSquare className="w-8 h-8" />
        </motion.a>
      </LanguageProvider>
    </Router>
  );
}

export default App;