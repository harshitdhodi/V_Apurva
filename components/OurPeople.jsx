// components/OurPeople.js (Server Component)
import OurPeopleClient from "./OurPeopleClient"

async function getHeadings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=ourpeople`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) throw new Error("Failed to fetch headings")
    return await response.json()
  } catch (error) {
    console.error("Error fetching headings:", error)
    return {}
  }
}

async function getOurPeopleData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ourpeople/getOurPeople`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) throw new Error("Failed to fetch our people data")
    const data = await response.json()
    return data.success && data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    console.error("Error fetching our people data:", error)
    return null
  }
}

export default async function OurPeople() {
  const [headings, ourPeopleData] = await Promise.all([
    getHeadings(),
    getOurPeopleData(),
  ])

  const data = {
    heading: headings.heading || '',
    subheading: headings.subheading || '',
    description: ourPeopleData?.description || '',
    currentPhoto: ourPeopleData?.photo || '',
    altText: ourPeopleData?.alt || '',
    imgTitle: ourPeopleData?.imgTitle || '',
  }

  return <OurPeopleClient data={data} />
}