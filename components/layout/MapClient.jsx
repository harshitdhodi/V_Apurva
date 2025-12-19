"use client"

import { useState, useEffect, useRef } from "react"

export default function MapClient({ location }) {
  const [mapInView, setMapInView] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!location) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapInView(true)
          observer.disconnect()
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    )
    if (mapRef.current) {
      observer.observe(mapRef.current)
    }
    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current)
      }
    }
  }, [location])

  return (
    <div ref={mapRef} className="w-full h-full">
      {mapInView ? (
        <iframe
          src={location || ""}
          className="border-0 w-full h-full rounded-md"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Company Location"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  )
}
