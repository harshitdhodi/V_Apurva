// app/about-us/page.js (Server Component)
import { Suspense } from 'react'
import NavbarServer from "@/components/NavbarServer"
import AboutImg from "@/components/AboutImg"
import Video from "@/components/Video"
import OurPeople from "@/components/OurPeople"
import PackagingType from "@/components/PackagingType"
import Partners from "@/components/Partners"
import OurProcess from "@/components/ourprocess/OurProcess"
import Footer from "@/components/layout/Footer"
import LoadingSpinner from "@/components/home/LoadingSpinner"

// Server-side data fetching functions
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

export default async function AboutUsPage() {
  // Fetch navbar data in parallel on the server
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
    <div className="min-h-screen">
      <NavbarServer
        headerData={headerData}
        footerData={footerData}
        menuItems={menuItems}
        colorLogo={colorLogo}
        productCategories={productCategories}
      />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <AboutImg />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Video />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <OurPeople />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <PackagingType />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <OurProcess />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Partners />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
