import { Inter } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from './client-layout';
import Footer from "@/components/layout/Footer"
import NavbarServer from "@/components/NavbarServer"

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const favicon = await getFaviconPath();
  return {
    title: 'Apurva Chemicals',
    description: 'Apurva Chemicals is a trusted dye intermediate manufacturer. We offer high-purity products, bulk supply options, and consistent quality for global clients.',
    metadataBase: new URL('https://v-apurva-a8cl.vercel.app'),
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: favicon || '/favicon.ico',
    },
    other: {
      'http-equiv': 'x-ua-compatible',
      content: 'ie=edge',
    },
  };
}

async function getFaviconPath() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logo/getfavicon`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch favicon");
    const data = await response.json();
    const filename = data?.photo;
    console.log("filename", filename);
    return filename ? `${process.env.NEXT_PUBLIC_API_URL}/api/logo/download/${filename}` : null; 
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return null;
  }
}

// Server-side data fetching functions (same as before)
async function getHeaderData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/header`, {
      
      next: { revalidate: 3600 },
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
      
      next: { revalidate: 3600 },
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
      
      next: { revalidate: 3600 },
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
      
      next: { revalidate: 3600 },
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
      
      next: { revalidate: 3600 },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://v-apurva-a8cl.vercel.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//v-apurva-a8cl.vercel.app" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
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
        <SpeedInsights />
        <Footer />
      </body>
    </html>
  );
}