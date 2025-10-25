// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { SiteIdentityProvider } from './context/SiteIdentityContext.jsx';
// --- LANGUAGE PROVIDER IS NO LONGER IMPORTED OR USED HERE ---
import App from './App';
import './index.css';
import { ProductCacheProvider } from './context/ProductCacheContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteIdentityProvider>
          <CartProvider>
            <ProductCacheProvider >
            <App />
            </ProductCacheProvider >
          </CartProvider>
        </SiteIdentityProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);