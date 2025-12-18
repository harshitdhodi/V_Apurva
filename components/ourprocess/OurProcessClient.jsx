// components/ourprocess/OurProcessClient.js (Client Component)
"use client"

import { useState, useEffect } from "react"
import ProcessSection from "./ProcessSection"
import MissionSection from "./MissionSection"
import VisionSection from "./VisionSection"

function OurProcessClient({ missionData, visionData }) {
  const [activeSection, setActiveSection] = useState("mission")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-auto w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
      </div>
    )
  }

  return (
    <div className="flex justify-center bg-white items-center pt-8 md:pt-16">
      <div className="px-4 pb-0 w-full">
        <div className="flex md:flex-row flex-col gap-6 md:gap-0 justify-center md:space-x-2 mb-6">
          {/* <button
            onClick={() => setActiveSection("process")}
            className={`bg-gray-200 p-2 md:px-16 md:py-6 xl:px-32 rounded hover:border-b-4 border-b-[#bf2e2e] hover:text-gray-800 hover:bg-white hover:shadow-lg text-gray-500 font-bold transition-all duration-300 ${
              activeSection === "process" ? "border-b-4 border-b-[#bf2e2e] text-gray-800 bg-white shadow-lg" : ""
            }`}
          >
            OUR PROCESS
          </button> */}
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

        <div className="min-h-auto w-full">
          {/* {activeSection === "process" && <ProcessSection />} */}
          {activeSection === "mission" && <MissionSection data={missionData} />}
          {activeSection === "value" && <VisionSection data={visionData} />}
        </div>
      </div>
    </div>
  )
}

export default OurProcessClient