import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductSliderClient from "./ProductSliderClient"

// Server-side data fetching
async function getProductData() {
  try {
    const [headingResponse, productsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=product`, {
        
        next: { revalidate: 3600 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/getActiveProductList`, {
        
        next: { revalidate: 1800 },
      }),
    ])

    const headingData = headingResponse.ok ? await headingResponse.json() : {}
    const productsData = productsResponse.ok ? await productsResponse.json() : {}

    return {
      heading: headingData.heading || "",
      subheading: headingData.subheading || "",
      products: Array.isArray(productsData.data) ? productsData.data : Array.isArray(productsData) ? productsData : [],
    }
  } catch (error) {
    console.error("Error fetching product data:", error)
    return {
      heading: "",
      subheading: "",
      products: [],
    }
  }
}

export default async function ProductsGrid() {
  const { heading, subheading, products } = await getProductData()

  if (products.length === 0) {
    return (
      <div className="bg-white lg:mt-[-10%] md:mt-[-15%] mt-[-20%] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No products available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white lg:mt-[-10%] md:mt-[-15%] mt-[-20%] py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          {heading && (
            <p className="text-[#bf2e2e] text-sm sm:text-base md:text-lg font-bold uppercase text-center sm:text-left mb-2">
              {heading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            {subheading && (
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-bold text-center sm:text-left">
                {subheading}
              </h2>
            )}
            <Link
              href="/products"
              className="flex items-center justify-center sm:justify-start gap-1 text-[#bf2e2e] font-medium py-2 hover:text-[#cd1d1d] transition-colors text-sm sm:text-base"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Product Slider - Client Component for interactivity */}
        <ProductSliderClient products={products} />
      </div>
    </div>
  )
}
