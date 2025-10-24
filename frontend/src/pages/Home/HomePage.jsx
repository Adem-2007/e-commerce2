import React, { Suspense } from 'react';
import HeroSlider from './components/HeroSlider/HeroSlider';
import CategoriesSectionSkeleton from './components/categories/CategoriesSectionSkeleton';

// Lazily import components that are not visible in the initial viewport.
// This is a form of code-splitting.
const CategoriesSection = React.lazy(() => import('./components/categories/CategoriesSection'));
const NewProducts = React.lazy(() => import('./components/NewProducts/NewProducts'));
const RandomProducts = React.lazy(() => import('./components/RandomProducts/RandomProducts'));

const HomePage = () => {
  return (
    <main className="bg-stone-50 overflow-x-hidden">
      {/* HeroSlider is critical and "above the fold", so it's loaded normally. */}
      <HeroSlider />

      {/* 
        Suspense wraps the lazy-loaded components. It will show the 'fallback' UI 
        until the requested component's code has been downloaded and is ready to render.
      */}
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>
      <Suspense fallback={<div className="flex h-96 w-full items-center justify-center bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" /></div>}>
        <NewProducts />
      </Suspense>
      <Suspense fallback={<div className="flex h-96 w-full items-center justify-center bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" /></div>}>
        <RandomProducts />
      </Suspense>
    </main>
  );
}

export default HomePage;