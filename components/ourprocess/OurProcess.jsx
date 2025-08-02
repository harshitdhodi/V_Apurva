// components/ourprocess/OurProcess.js (Server Component)
import OurProcessClient from "./OurProcessClient"

async function getMissionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mission/getAllActiveMissions`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) throw new Error("Failed to fetch mission data")
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error("Error fetching mission data:", error)
    return {}
  }
}

async function getVisionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vision/getAllActiveVisions`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) throw new Error("Failed to fetch vision data")
    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error("Error fetching vision data:", error)
    return {}
  }
}

export default async function OurProcess() {
  const [missionData, visionData] = await Promise.all([
    getMissionData(),
    getVisionData(),
  ])

  return (
    <OurProcessClient 
      missionData={missionData} 
      visionData={visionData} 
    />
  )
}