// Carousel.jsx
import CarouselClient from "./CarouselClient";
import ParticleBackground from "@/components/ParticleBackground";

export default function Carousel({ banners }) {
  // Validate banners prop
  if (!banners || !Array.isArray(banners) || banners.length === 0) {
    return <div className="text-center py-8 text-gray-600">No banners available</div>;
  }

  return (
    <div className="relative flex bg-white justify-center items-center md:mb-16">
      <ParticleBackground />
      <div className="relative w-full max-w-8xl mx-auto p-4">
        {/* Pass banners to client component for interactivity */}
        <CarouselClient banners={banners} />
      </div>
    </div>
  )
}