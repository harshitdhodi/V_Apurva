import ProductSliderClient from "./ProductSliderClient"

// Server component to fetch data
async function ProductGrid() {
  let product = []
  let heading = ""
  let subheading = ""

  try {
    // Fetch products
    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/product/getActiveProducts`, {
      credentials: "include",
      cache: "no-store", // or 'force-cache' depending on your needs
    })

    if (productResponse.ok) {
      const productData = await productResponse.json()
      product = Array.isArray(productData?.data) ? productData.data : Array.isArray(productData) ? productData : []
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    product = []
  }

  try {
    // Fetch headings
    const headingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/pageHeading/heading?pageType=product`,
      {
        credentials: "include",
        cache: "no-store",
      },
    )

    if (headingResponse.ok) {
      const headingData = await headingResponse.json()
      heading = headingData.heading || ""
      subheading = headingData.subheading || ""
    }
  } catch (error) {
    console.error("Error fetching headings:", error)
  }

  return <ProductSliderClient products={product} heading={heading} subheading={subheading} />
}

export default ProductGrid
