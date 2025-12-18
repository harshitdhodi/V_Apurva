/**
 * Dynamic imports for third-party libraries to reduce initial bundle size
 * This utility helps with code splitting and lazy loading of heavy dependencies
 */

// Import utility for checking if the code is running on the server
const isServer = typeof window === 'undefined';

// Cache for loaded libraries
const libraryCache = new Map();

/**
 * Dynamically imports a library with error handling and caching
 * @param {string} libraryName - Name of the library to import
 * @returns {Promise<Object>} - The imported library
 */
export const importLibrary = async (libraryName) => {
  if (libraryCache.has(libraryName)) {
    return libraryCache.get(libraryName);
  }

  try {
    let library;
    
    // Handle specific libraries with custom import paths
    switch (libraryName) {
      case 'gsap':
        library = await import('gsap');
        break;
      case 'react-slick':
        library = await import('react-slick');
        // Also import the CSS
        if (!isServer) {
          await import('slick-carousel/slick/slick.css');
          await import('slick-carousel/slick/slick-theme.css');
        }
        break;
      case 'react-google-recaptcha':
        library = await import('react-google-recaptcha');
        break;
      case 'lucide-react':
        library = await import('lucide-react');
        break;
      case 'react-icons':
        library = await import('react-icons');
        break;
      case 'react-icons/fa':
        library = await import('react-icons/fa');
        break;
      case 'react-icons/io5':
        library = await import('react-icons/io5');
        break;
      case 'react-icons/bs':
        library = await import('react-icons/bs');
        break;
      default:
        // For any other library not explicitly listed
        library = await import(libraryName);
    }

    // Cache the library
    if (library) {
      libraryCache.set(libraryName, library);
      return library;
    }

    throw new Error(`Failed to load library: ${libraryName}`);
  } catch (error) {
    console.error(`Error loading library ${libraryName}:`, error);
    throw error;
  }
};

/**
 * Creates a component that dynamically imports a library and renders a component from it
 * @param {Object} options - Configuration options
 * @param {string} options.library - Name of the library to import
 * @param {string} [options.exportName] - Name of the export to use (defaults to 'default')
 * @param {React.ComponentType} [options.Fallback] - Fallback component to render while loading
 * @param {Object} [options.libraryProps] - Props to pass to the library component
 * @returns {React.ComponentType} - A component that renders the dynamically imported component
 */
export const withDynamicImport = ({
  library,
  exportName = 'default',
  Fallback = null,
  libraryProps = {},
}) => {
  return function DynamicComponent(props) {
    const [Component, setComponent] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      let isMounted = true;

      const loadComponent = async () => {
        try {
          setIsLoading(true);
          const lib = await importLibrary(library);
          
          if (isMounted) {
            // Handle default exports and named exports
            const component = exportName === 'default' 
              ? lib.default 
              : lib[exportName];
              
            if (!component) {
              throw new Error(`Export '${exportName}' not found in ${library}`);
            }
            
            setComponent(() => component);
            setError(null);
          }
        } catch (err) {
          console.error(`Error loading component from ${library}:`, err);
          if (isMounted) {
            setError(err);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      // Add a small delay to prevent loading during initial paint
      const timer = setTimeout(loadComponent, 100);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }, [library, exportName]);

    if (error) {
      return Fallback ? <Fallback error={error} /> : null;
    }

    if (isLoading || !Component) {
      return Fallback ? <Fallback /> : null;
    }

    return <Component {...libraryProps} {...props} />;
  };
};

// Example usage:
/*
// In your component file:
import { withDynamicImport } from '@/utils/dynamicImports';

// For a component with a default export
const HeavyComponent = withDynamicImport({
  library: 'heavy-library',
  Fallback: () => <div>Loading...</div>,
  libraryProps: { /* initial props */ 
// });

// For a named export
const NamedExportComponent = withDynamicImport({
  library: 'some-library',
  exportName: 'NamedExport',
  Fallback: () => <div>Loading...</div>,
});

