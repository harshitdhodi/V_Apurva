"use client"

import { useState } from "react"

export default function ContactFormClient({ buttonText = "Contact Us" }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-[#bf2e2e] hover:bg-[#cd1d1d] text-white text-base sm:text-lg font-medium p-3 sm:p-4 rounded lg:px-7 transition-colors duration-300"
      >
        {buttonText}
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contact Us</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#bf2e2e] hover:bg-[#cd1d1d] text-white p-3 rounded transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
