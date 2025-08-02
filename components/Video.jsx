import VideoClient from "./VideoClient"

// Server-side data fetching
async function getAboutUsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aboutus/active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching about us data:", error)
    return null
  }
}

export default async function Video() {
  const pageContent = await getAboutUsData()

  // Handle case where no content is available
  if (!pageContent) {
    return (
      <div className="flex justify-center relative -top-20 items-center md:py-16 bg-gray-100 min-h-[300px]">
        <div className="p-4 md:px-20 w-full max-w-8xl">
          <div className="text-center text-gray-500 py-10">No content available</div>
        </div>
      </div>
    )
  }

  return (
    <>
    <VideoClient data={pageContent}/>
    </>
  )
}
