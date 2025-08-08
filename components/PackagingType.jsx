// components/PackagingType.js (Server Component)
import PackagingTypeClient from "./PackagingTypeClient"

async function getPackagingDetail() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packagingdetail/getPackagingDetail`, {
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch packaging detail")
    return await response.json()
  } catch (error) {
    console.error("Error fetching packaging detail:", error)
    return {}
  }
}

async function getPageHeadings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=packagingType`, {
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch page headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching page headings:", error)
    return {}
  }
}

async function getPackagingTypes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packaging-types`, {
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch packaging types")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching packaging types:", error)
    return []
  }
}

export default async function PackagingType() {
  const [packagingDetail, pageHeadings, packagingTypes] = await Promise.all([
    getPackagingDetail(),
    getPageHeadings(),
    getPackagingTypes(),
  ])

  const data = {
    description: packagingDetail?.description || "",
    heading: packagingDetail?.heading || "",
    subheading: packagingDetail?.subheading || "",
    heading2: pageHeadings?.heading || "",
    subheading2: pageHeadings?.subheading || "",
    packagingTypes: packagingTypes,
  }

  return <PackagingTypeClient data={data} />
}