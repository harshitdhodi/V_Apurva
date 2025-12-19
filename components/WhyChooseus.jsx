import { Suspense } from "react";

// Simple HTML parser for description content
function parseDescription(description) {
  if (!description) return null;

  // Basic HTML sanitization - you might want to use a proper HTML sanitizer in production
  const cleanDescription = description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return cleanDescription;
}

// FeatureCard component for server rendering
function FeatureCard({ icon, title, description }) {
  const parsedDescription = parseDescription(description);

  return (
    <div className="flex flex-col justify-center items-center md:items-start p-6">
      <div className="bg-white rounded-full p-6 w-fit mb-8 transition-all duration-1000">
        {/* <img
          className="text-5xl text-primary transition-all duration-1000 w-[2cm]"
          src={`/api/image/download/${icon}`}
          alt={title}
          loading="lazy"
        /> */}
        <video className="w-[2.3cm] object-cover transition-all duration-1000"
          src={`https://admin.apurvachemicals.com/api/image/video/${icon}`}
          autoPlay
          muted
          loop ></video>
      </div>
      <h3 className="text-2xl mb-4 font-bold text-white font-daysOne text-center md:text-left">
        {title}
      </h3>
      {parsedDescription && (
        <div
          className="prose prose-sm sm:prose-base font-sans max-w-none text-center md:text-left text-xl text-[#bf2e2e] font-semibold"
          dangerouslySetInnerHTML={{ __html: parsedDescription }} 
        />
      )}
    </div>
  );
}

// Skeleton loader component
function SkeletonLoader() {
  return (
    <div className="flex flex-col justify-center items-center md:items-start p-6 animate-pulse h-80">
      <div className="bg-gray-700 rounded-full w-20 h-20 mb-8" />
      <div className="h-6 w-40 bg-gray-700 rounded mb-4" />
      <div className="h-16 w-64 bg-gray-700 rounded" />
      <div className="h-4 w-48 bg-gray-700 rounded mt-2" />
    </div>
  );
}

// Error component
function ErrorDisplay({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
      <p className="text-red-600 mb-4">{message || "Unable to load the content"}</p>
    </div>
  );
}

// Data fetching function
async function fetchWhyChooseUsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const [headingsResponse, dataResponse] = await Promise.all([
      fetch(`${baseUrl}/api/pageHeading/heading?pageType=whychooseus`, {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json"
        },
        next: { revalidate: 60 } // Revalidate every hour
      }),
      fetch(`${baseUrl}/api/whychooseus/getAllWhyChooseUs`, {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json"
        },
        next: { revalidate: 60 } // Revalidate every hour
      })
    ]);

    if (!headingsResponse.ok || !dataResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const [headingsData, responseData] = await Promise.all([
      headingsResponse.json(),
      dataResponse.json()
    ]);

    const { heading = "Why Choose Us", subheading = "Discover What Makes Us Different" } = headingsData || {};
    const items = Array.isArray(responseData?.data) ? responseData.data : [];
    console.log("items", items)
    return {
      heading,
      subheading,
      items,
      error: null
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      heading: "Why Choose Us",
      subheading: "Discover What Makes Us Different",
      items: [],
      error: "Failed to load content"
    };
  }
}

// Loading component for Suspense
function LoadingContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonLoader key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

// Content component that fetches data
async function WhyChooseUsContent() {
  const data = await fetchWhyChooseUsData();

  if (data.error) {
    return <ErrorDisplay message={data.error} />;
  }

  return (
    <>
      <h2 className="md:text-[20px] pt-12 font-bold font-daysOne text-primary text-center mb-6 uppercase text-[#bf2e2e]">
        {data.heading}
      </h2>
      <h2 className="text-3xl sm:text-4xl font-bold font-daysOne text-center mb-8 capitalize">
        {data.subheading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.items.length === 0 ? (
          <div className="col-span-full text-center mt-12">
            <p className="text-gray-400 text-lg">No features available at the moment.</p>
          </div>
        ) : (
          data.items.map((item, index) => (
            <FeatureCard
              key={item.id || `feature-${index}`}
              icon={item.photo}
              title={item.title}
              description={item.description}
            />
          ))
        )}
      </div>
    </>
  );
}

// Main server component
export default function WhyChooseUs() {
  return (
    <section className="bg-black text-white flex justify-center items-center lg:h-[750px]">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingContent />}>
          <WhyChooseUsContent />
        </Suspense>
      </div>
    </section>
  );
}
