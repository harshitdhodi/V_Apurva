"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ProcessSection from "./ProcessSection"
import MissionSection from "./MissionSection"
import VisionSection from "./VisionSection"

function OurProcess() {
  const [activeSection, setActiveSection] = useState("process")
  const [missionData, setMissionData] = useState({})
  const [visionData, setVisionData] = useState({})
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState({
    mission: false,
    vision: false
  })
  const [error, setError] = useState({
    mission: null,
    vision: null
  })

  useEffect(() => {
    setIsClient(true)
    fetchMission()
    fetchVisionData()
  }, [])

  const fetchMission = async () => {
    setLoading(prev => ({ ...prev, mission: true }))
    setError(prev => ({ ...prev, mission: null }))
    try {
      const response = await axios.get("/api/mission/getAllActiveMissions")
      setMissionData(response.data.data || {})
    } catch (error) {
      console.error("Error fetching mission data:", error)
      setError(prev => ({
        ...prev,
        mission: error.response?.data?.error || 'Failed to fetch mission data'
      }))
    } finally {
      setLoading(prev => ({ ...prev, mission: false }))
    }
  }

  const fetchVisionData = async () => {
    setLoading(prev => ({ ...prev, vision: true }))
    setError(prev => ({ ...prev, vision: null }))
    try {
      const response = await axios.get("/api/vision/getAllActiveVisions")
      setVisionData(response.data.data || {})
    } catch (error) {
      console.error("Error fetching vision data:", error)
      setError(prev => ({
        ...prev,
        vision: error.response?.data?.error || 'Failed to fetch vision data'
      }))
    } finally {
      setLoading(prev => ({ ...prev, vision: false }))
    }
  }

  if (!isClient) {
    return <div className="min-h-[400px] w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
    </div>
  }

  return (
    <div className="flex justify-center bg-white items-center pt-8 md:pt-16">
      <div className="px-4 pb-0 w-full">
        <div className="flex md:flex-row flex-col gap-6 md:gap-0 justify-center md:space-x-2 mb-6">
          <button
            onClick={() => setActiveSection("process")}
            className={`bg-gray-200 p-2 md:px-16 md:py-6 xl:px-32 rounded hover:border-b-4 border-b-[#bf2e2e] hover:text-gray-800 hover:bg-white hover:shadow-lg text-gray-500 font-bold transition-all duration-300 ${
              activeSection === "process" ? "border-b-4 border-b-[#bf2e2e] text-gray-800 bg-white shadow-lg" : ""
            }`}
          >
            OUR PROCESS
          </button>
          <button
            onClick={() => setActiveSection("mission")}
            className={`bg-gray-200 p-2 md:px-16 md:py-6 xl:px-32 rounded hover:border-b-4 border-b-[#bf2e2e] hover:text-gray-800 hover:bg-white hover:shadow-lg text-gray-500 font-bold transition-all duration-300 ${
              activeSection === "mission" ? "border-b-4 border-b-[#bf2e2e] text-gray-800 bg-white shadow-lg" : ""
            }`}
          >
            OUR MISSION
          </button>
          <button
            onClick={() => setActiveSection("value")}
            className={`bg-gray-200 p-2 md:px-16 md:py-6 xl:px-32 rounded hover:border-b-4 border-b-[#bf2e2e] hover:text-gray-800 hover:bg-white hover:shadow-lg text-gray-500 font-bold transition-all duration-300 ${
              activeSection === "value" ? "border-b-4 border-b-[#bf2e2e] text-gray-800 bg-white shadow-lg" : ""
            }`}
          >
            OUR VISION
          </button>
        </div>

        <div className="min-h-[400px] w-full">
          {activeSection === "process" && <ProcessSection />}
          {activeSection === "mission" && (
            <div>
              {loading.mission ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
                </div>
              ) : error.mission ? (
                <div className="text-center py-10 text-red-500">
                  {error.mission}
                  <button 
                    onClick={fetchMission}
                    className="ml-2 px-3 py-1 bg-[#bf2e2e] text-white rounded hover:bg-[#bf2e2e]-dark"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <MissionSection data={missionData} />
              )}
            </div>
          )}
          {activeSection === "value" && (
            <div>
              {loading.vision ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
                </div>
              ) : error.vision ? (
                <div className="text-center py-10 text-red-500">
                  {error.vision}
                  <button 
                    onClick={fetchVisionData}
                    className="ml-2 px-3 py-1 bg-[#bf2e2e] text-white rounded hover:bg-[#bf2e2e]-dark"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <VisionSection data={visionData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OurProcess
