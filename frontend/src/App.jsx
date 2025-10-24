// src/App.jsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardLanguageProvider } from './context/DashboardLanguageContext';

// --- LAYOUTS & COMMON ---
import Navbar from './common/Navbar/Navbar';
import Footer from './common/footer/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ScrollToTop from './hooks/ScrollToTop';
import ProtectedRoute from './components/ProtectRouter/ProtectedRoute';
import DynamicHead from './components/DynamicHead';

// --- LAZY-LOADED PUBLIC PAGES ---
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const ContactUsPage = lazy(() => import('./pages/contact/ContactUsPage'));
const ProductPage = lazy(() => import('./pages/Product/main/ProductPage'));
const ProductDetailPage = lazy(() => import('./pages/Product/detail/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));
const BuyPage = lazy(() => import('./pages/Product/BuyPage/BuyPage'));
const AuthCallbackPage = lazy(() => import('./pages/Auth/components/AuthCallbackPage'));

// --- LAZY-LOADED DASHBOARD PAGES ---
const DashboardOverview = lazy(() => import('./pages/Dashboard/overview/DashboardOverview'));
const OrdersPage = lazy(() => import('./pages/Dashboard/Orders/OrdersPage'));
const CategoriesProducts = lazy(() => import('./pages/Dashboard/Categories/CategoriesProducts'));
const HeroControl = lazy(() => import('./pages/Dashboard/Hero/HeroControl'));
const InfoControl = lazy(() => import('./pages/Dashboard/Info/InfoControl'));
const FooterControl = lazy(() => import('./pages/Dashboard/Footer/FooterControl'));
const LogoControl = lazy(() => import('./pages/Dashboard/Logo/LogoControl'));
const DeliveryCostsPage = lazy(() => import('./pages/Dashboard/Delivery/DeliveryCostsPage'));
const SocialMediaControl = lazy(() => import('./pages/Dashboard/SocialMedia/SocialMediaControl'));
const UserManagePage = lazy(() => import('./pages/Dashboard/UserManage/UserManagePage'));
const MessagesPage = lazy(() => import('./pages/Dashboard/Messages/MessagesPage'));
const ImageController = lazy(() => import('./pages/Dashboard/Image/ImageController'));

// --- WRAPPERS FOR CONTEXT PROVIDERS ---
const PublicLayoutWrapper = () => {
  // The useEffect hook for injecting Facebook pixels has been removed.
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow"><Outlet /></main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

const DashboardLayoutWrapper = () => (
  <DashboardLanguageProvider>
    <DashboardLayout />
  </DashboardLanguageProvider>
);

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2>Loading...</h2>
  </div>
);

function App() {
  return (
    <>
      <DynamicHead />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route element={<PublicLayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ProductPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Route>

          {/* --- Standalone Auth Routes --- */}
          <Route path="/auth" element={<LanguageProvider><AuthPage /></LanguageProvider>} />
          <Route path="/reset-password" element={<LanguageProvider><ResetPasswordPage /></LanguageProvider>} />
          <Route path="/auth/callback" element={<LanguageProvider><AuthCallbackPage /></LanguageProvider>} />

          {/* --- Dashboard Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayoutWrapper />}>
              <Route index element={<DashboardOverview />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="categories-products" element={<CategoriesProducts />} />
              <Route path="hero-control" element={<HeroControl />} />
              <Route path="info-control" element={<InfoControl />} />
              <Route path="footer-control" element={<FooterControl />} />
              <Route path="logo-control" element={<LogoControl />} />
              <Route path="delivery-costs" element={<DeliveryCostsPage />} />
              <Route path="social-media" element={<SocialMediaControl />} />
              <Route path="user-manage" element={<UserManagePage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="image" element={<ImageController />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;