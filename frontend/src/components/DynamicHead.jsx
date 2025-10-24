// src/components/DynamicHead.jsx

import { useEffect } from 'react';
import { useSiteIdentity } from '../context/SiteIdentityContext';

const DynamicHead = () => {
  const { siteName, logoUrl } = useSiteIdentity();

  useEffect(() => {
    // Only update the title if siteName is not empty
    if (siteName) {
      document.title = siteName;
    }
  }, [siteName]);

  useEffect(() => {
    // Only update the favicon if logoUrl is not empty or a placeholder
    if (logoUrl && logoUrl !== '/') {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [logoUrl]);

  // This component does not render anything to the DOM itself
  return null;
};

export default DynamicHead;