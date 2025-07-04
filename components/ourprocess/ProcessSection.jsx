"use client"

import { FileText, TestTube2, FileCheck } from "lucide-react"

function ProcessStep({ icon, title, description }) {
  return (
    <div className="px-5 flex flex-col justify-center shadow-lg items-center">
      <div className="text-8xl text-[#bf2e2e]">{icon}</div>
      <div className="flex flex-col justify-center items-center text-center space-y-5 py-5">
        <p className="text-2xl font-bold text-[#000]">{title}</p>
        <p className="text-gray-500 px-10">{description}</p>
      </div>
    </div>
  )
}

export default function ProcessSection() {
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 lg:mx-12 md:grid-cols-2 lg:grid-cols-3 md:py-10 gap-6">
        <ProcessStep
          icon={<FileText className="w-16 h-16 text-[#bf2e2e]" />}
          title="Generate Proposal"
          description="Testing Begins many various suffered alter in some"
        />
        <ProcessStep
          icon={<TestTube2 className="w-16 h-16 text-[#bf2e2e]" />}
          title="Testing Begins"
          description="There are many various passages suffered alter in some"
        />
        <ProcessStep
          icon={<FileCheck className="w-16 h-16 text-[#bf2e2e]" />}
          title="Generate Report"
          description="Various passages suffered alteration in some form"
        />
      </div>
    </div>
  )
}
