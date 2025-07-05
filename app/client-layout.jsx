'use client';

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Remove bis_skin_checked attributes that might be added by extensions
    const removeExtensionAttributes = () => {
      document.querySelectorAll('[bis_skin_checked]').forEach(el => {
        el.removeAttribute('bis_skin_checked');
      });
    };

    // Load CSS after component mounts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/_next/static/css/ec27aafff3e3f0d4.css`;
    document.head.appendChild(link);

    // Initial cleanup
    removeExtensionAttributes();
    
    // Set up a mutation observer to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
          mutation.target.removeAttribute('bis_skin_checked');
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked']
    });

    return () => {
      // Clean up
      document.head.removeChild(link);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}