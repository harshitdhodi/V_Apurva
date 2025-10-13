// components/Partners.js (Server Component)
import PartnersClient from "./PartnersClient"

async function getPartners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/getActivePartners`, {
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error("Failed to fetch partners")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching partners:", error)
    return []
  }
}

export default async function Partners() {
  const partners = await getPartners()

  if (!partners || partners.length === 0) {
    return null
  }

  return <PartnersClient partners={partners} />
}