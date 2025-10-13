import AboutImgClient from "./AboutImgClient"

// components/AboutImg.js (Server Component)

async function getBanners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/getBannersBySectionAboutus`, {
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}

export default async function AboutImg() {
  const banners = await getBanners()

  if (!banners.length) {
    return (
      <div className="h-[40vh] md:h-[30vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No banners available</p>
      </div>
    )
  }

  return <AboutImgClient banners={banners} />
}