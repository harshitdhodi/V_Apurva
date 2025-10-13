'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DynamicImport component for code splitting and lazy loading
 * @param {Object} props - Component props
 * @param {string} props.load - Path to the component to load
 * @param {Object} [props.props] - Props to pass to the dynamically loaded component
 * @param {ReactNode} [props.fallback] - Fallback UI while the component is loading
 * @param {boolean} [props.ssr] - Whether to enable server-side rendering
 * @returns {JSX.Element} - The dynamically loaded component
 */
const DynamicImport = ({ load, props = {}, fallback = null, ssr = false }) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const loadComponent = async () => {
      try {
        // Add a small delay to prevent loading during initial paint
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 100);
        });

        if (!mounted) return;

        // Only load the component if it's in the viewport
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                // Use dynamic import to load the component
                import(/* webpackChunkName: "dynamic-[request]" */ `@/${load}`)
                  .then((module) => {
                    if (mounted) {
                      setComponent(() => module.default);
                    }
                  })
                  .catch((err) => {
                    console.error(`Failed to load component: ${load}`, err);
                    if (mounted) {
                      setError(err);
                    }
                  });
              }
            },
            { rootMargin: '200px' } // Start loading when the component is 200px from viewport
          );

          const placeholder = document.createElement('div');
          observer.observe(placeholder);

          return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
          };
        } else {
          // Fallback for browsers without IntersectionObserver
          import(/* webpackChunkName: "dynamic-[request]" */ `@/${load}`)
            .then((module) => {
              if (mounted) {
                setComponent(() => module.default);
              }
            })
            .catch((err) => {
              console.error(`Failed to load component: ${load}`, err);
              if (mounted) {
                setError(err);
              }
            });
        }
      } catch (err) {
        console.error('Error in DynamicImport:', err);
        if (mounted) {
          setError(err);
        }
      }
    };

    if (typeof window !== 'undefined') {
      loadComponent();
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [load]);

  // Handle server-side rendering
  if (typeof window === 'undefined') {
    return ssr ? (
      <Suspense fallback={fallback}>
        {React.createElement(React.lazy(() => import(`@/${load}`)), props)}
      </Suspense>
    ) : (
      fallback
    );
  }

  // Handle client-side rendering
  if (error) {
    console.error('Error in DynamicImport:', error);
    return fallback;
  }

  if (!Component) {
    return fallback;
  }

  return <Component {...props} />;
};

DynamicImport.propTypes = {
  load: PropTypes.string.isRequired,
  props: PropTypes.object,
  fallback: PropTypes.node,
  ssr: PropTypes.bool,
};

export default DynamicImport;
