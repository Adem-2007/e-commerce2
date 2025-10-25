// src/context/ProductCacheContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';

const ProductCacheContext = createContext({
  cachedProducts: {},
  updateProductInCache: () => {},
  lastUpdatedProductId: null, // New: track the last updated product
  setLastUpdatedProductId: () => {}, // New: function to set it
});

export const ProductCacheProvider = ({ children }) => {
  const [cachedProducts, setCachedProducts] = useState({});
  const [lastUpdatedProductId, setLastUpdatedProductId] = useState(null);

  const updateProductInCache = useCallback((productId, updatedData) => {
    setCachedProducts(prevCache => ({
      ...prevCache,
      [productId]: { ...prevCache[productId], ...updatedData },
    }));
  }, []);

  const value = {
    cachedProducts,
    updateProductInCache,
    lastUpdatedProductId,
    setLastUpdatedProductId,
  };

  return (
    <ProductCacheContext.Provider value={value}>
      {children}
    </ProductCacheContext.Provider>
  );
};

export const useProductCache = () => {
  return useContext(ProductCacheContext);
};