import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ClientLayout from './client-layout';
import Footer from "@/components/layout/Footer"
import NavbarServer from "@/components/NavbarServer"

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  return {
    title: 'Apurva Chemicals',
    description: 'Apurva Chemicals is a trusted dye intermediate manufacturer. We offer high-purity products, bulk supply options, and consistent quality for global clients.',
    metadataBase: new URL('https://www.apurvachemicals.com'),
    alternates: {
      canonical: '/',
    },
    other: {
      'http-equiv': 'x-ua-compatible',
      content: 'ie=edge',
    },
  };
}

// Server-side data fetching functions (same as before)
async function getHeaderData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/header`, {
      
      next: { revalidate: 0 },
    })  
    if (!response.ok) throw new Error("Failed to fetch header data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching header data:", error)
    return {}
  }
}

async function getFooterData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/footer`, {
      
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch footer data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching footer data:", error)
    return {}
  }
}

async function getMenuListings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/getMenulisting`, {
      
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch menu listings")
    const data = await response.json()
    return data.menuListings || []
  } catch (error) {
    console.error("Error fetching menu listings:", error)
    return []
  }
}

async function getProductCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/getCategoryAndPhoto`, {
      
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch product categories")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching product categories:", error)
    return []
  }
}

async function getColorLogo() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logo/header-color`, {
      
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch color logo")
    return await response.json()
  } catch (error) {
    console.error("Error fetching color logo:", error)
    return []
  }
}

export default async function RootLayout({ children }) {

  const [headerData, footerData, menuListings, productCategories, colorLogo] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getMenuListings(),
    getProductCategories(),
    getColorLogo(),
  ])

  // Process menu items on server
  const menuPaths = {
    about: "/about-us",
    contact: "/contact-us",
    blog: "/blogs",
  }

  const menuItems = menuListings
    .map((item) => {
      if (!item || !item.pagename) return null
      const pagenameLower = item.pagename.toLowerCase()
      let path = item.path || ""

      if (pagenameLower.includes("about")) {
        path = menuPaths.about
      } else if (pagenameLower.includes("blog")) {
        path = menuPaths.blog
      } else if (pagenameLower.includes("products")) {
        path = menuPaths.product
      } else if (pagenameLower.includes("contact")) {
        path = menuPaths.contact
      }

      if ((item.pagename === "Product" || item.pagename === "Products") && productCategories.length > 0) {
        return {
          ...item,
          path,
          subItems: productCategories.map((category) => ({
            title: category.category || "",
            path: `/${category.slug || ""}`,
          })),
        }
      }

      return { ...item, path }
    })
    .filter(Boolean)


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://www.apurvachemicals.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.apurvachemicals.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <meta name="robots" content="index,follow" />
        
        {/* Self-hosted GTM script with delayed loading */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`
            // Create a function to load GTM
            function loadGTM() {
              // Create GTM script
              const gtmScript = document.createElement('script');
              gtmScript.async = true;
              gtmScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-LD63FPNG0X';
              
              // Add to document
              document.head.appendChild(gtmScript);
              
              // Initialize dataLayer
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LD63FPNG0X', {
                'transport_type': 'beacon',
                'anonymize_ip': true
              });
              
              // Mark as loaded to prevent duplicate loading
              window.gtmLoaded = true;
            }
            
            // Load GTM after a delay or when the page is fully interactive
            function handleLoad() {
              // If GTM is already loaded, do nothing
              if (window.gtmLoaded) return;
              
              // If the page is already interactive, load GTM immediately
              if (document.readyState === 'interactive' || document.readyState === 'complete') {
                loadGTM();
              } else {
                // Otherwise, wait for the page to be interactive
                document.addEventListener('readystatechange', function() {
                  if (document.readyState === 'interactive') {
                    loadGTM();
                  }
                }, { once: true });
              }
            }
            
            // Start loading GTM after a 2-second delay
            setTimeout(handleLoad, 2000);
            
            // Also load GTM if the user interacts with the page
            const interactionEvents = ['scroll', 'mousemove', 'keydown', 'touchstart'];
            const handleInteraction = () => {
              if (!window.gtmLoaded) {
                loadGTM();
                // Remove event listeners after first interaction
                interactionEvents.forEach(event => {
                  window.removeEventListener(event, handleInteraction);
                });
              }
            };
            
            // Add interaction event listeners
            interactionEvents.forEach(event => {
              window.addEventListener(event, handleInteraction, { once: true, passive: true });
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <NavbarServer
                headerData={headerData}
                footerData={footerData}
                menuItems={menuItems}
                colorLogo={colorLogo}
                productCategories={productCategories}
              />
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  );
}