import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import LanguageContext and translations from LanguageGlobe.js
import LanguageGlobe, { LanguageContext, translations } from './pages/LanguageGlobe'; // Adjust path as needed

// Core pages (no layout)
import Login from './pages/Login';
import Register from './pages/Register';

// Layout component
import Layout from './pages/Layout'; // Assuming Layout.js is in src/pages/Layout.js

// User-facing pages (will be inside Layout)
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import VIPPage from './pages/VIPPage';
import OrderSummary from './pages/OrderSummary';
import RechargePage from './pages/RechargePage';
import RecordsPage from './pages/RecordsPage';
import OrderDashboard from './pages/OrderDashboard';
// import LanguageSelector from './pages/LanguageGlobe'; // Removed: LanguageGlobe is now a component, not a route
import AccountPage from './pages/AccountPage';
import ReferralCode from './pages/ReferralCode';
import ProductRatingPage from './pages/ProductRatingPage';

// Admin pages (will be inside Layout)
import AdminPage from './pages/admin/AdminPage'; // If used as a general admin landing
import AdminDashboard from './pages/admin/AdminDashboard'; // Specific admin dashboard
import UserManagement from './pages/admin/UserManagement'; // If used
import VIPSettings from './pages/admin/VIPSettings'; // If used
import ReferralManagement from './pages/admin/ReferralManagement'; // If used
import TransactionManagement from './pages/admin/TransactionManagement'; // If used
import UserTable from './pages/UserTable'; // UserTable is in src/pages
import InjectionPlan from './pages/InjectionPlan'; // FIX: InjectionPlan is in src/pages/admin
import ManualPayment from './pages/ManualPayment';
import UserSettingsPage from './pages/UserSettingsPage';
import WithdrawalPage from './pages/WithdrawalPage';

// HistoryModal and SettingModal are typically rendered as components, not direct routes.
// They are imported and used within UserTable.js
// import HistoryModal from './pages/admin/HistoryModal';
// import SettingModal from './pages/admin/SettingModal';

function App() {
  // State for the current language, initialized to 'English'
  const [currentLanguage, setCurrentLanguage] = useState('English');

  // Translation function: looks up the key in the current language's translations
  // Falls back to the key itself if translation is not found
  const t = (key) => translations[currentLanguage]?.[key] || key;

  return (
    // Provide the LanguageContext to all components wrapped by this Provider.
    // This allows any component within the Router to access currentLanguage, setCurrentLanguage, and t.
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      {/* Tailwind CSS CDN and Inter font for basic styling.
          Ideally, these belong in your public/index.html or main layout file.
          Included here for self-contained runnable example. */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          font-family: 'Inter', sans-serif;
        }
        /* Basic animations for modal */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        `}
      </style>

      <Router>
        {/* The LanguageGlobe component is placed here to be globally available,
            e.g., as a fixed icon in the corner, regardless of the route. */}
        <LanguageGlobe />

        <Routes>
          {/* Routes without the main layout (e.g., login, register) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} /> {/* Default landing page */}

          {/* All routes that should use the shared Layout (with responsive sidebar/bottom navbar) */}
          <Route element={<Layout />}>
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order-dashboard" element={<OrderDashboard />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/ordersummary" element={<OrderSummary />} />
            <Route path="/recharge" element={<RechargePage />} />
            <Route path="/referral" element={<ReferralCode />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/product-rating" element={<ProductRatingPage />} />
            {/* <Route path="/selector" element={<LanguageSelector />} />  Removed: LanguageGlobe is a component, not a route */}
            <Route path="/payment" element={<ManualPayment />} />
            <Route path="/settings" element={<UserSettingsPage />} />
            <Route path="/withdraw" element={<WithdrawalPage />} />

            {/* Admin Routes - NOW NESTED INSIDE LAYOUT */}
            <Route path="/admin" element={<AdminDashboard />} /> {/* Admin landing page */}
            <Route path="/usertable" element={<UserTable />} /> {/* UserTable now gets layout styling */}
            <Route path="/admin/injection" element={<InjectionPlan />} /> {/* InjectionPlan now gets layout styling */}

            {/* Optional: If you have specific admin sub-pages that also need the layout */}
            {/* <Route path="/admin/user-management" element={<UserManagement />} /> */}
            {/* <Route path="/admin/vip-settings" element={<VIPSettings />} /> */}
            {/* <Route path="/admin/referral-management" element={<ReferralManagement />} /> */}
            {/* <Route path="/admin/transaction-management" element={<TransactionManagement />} /> */}

            {/* Removed direct routes for modals as they are controlled by parent components */}
            {/* <Route path="/history-modal" element={<HistoryModal />} /> */}
            {/* <Route path="/setting-modal" element={<SettingModal />} /> */}

          </Route>

          {/* Catch-all for any unmatched routes, redirects to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
