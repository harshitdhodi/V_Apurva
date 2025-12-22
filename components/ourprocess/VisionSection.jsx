"use client";

function VisionSection({ data }) {
  const { title, description, photo, alt, imgTitle } = data;

  return (
    <section className="py-5">
      <div className="md:mx-12 md:px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          {description && (
            <div 
              className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl text-justify text-gray-600"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photo?.[0] && (
            <img
              src={`/api/image/download/${photo[0]}`}
              alt={alt?.[0] || ''}
              title={imgTitle?.[0]}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          )}
          {photo?.[1] && (
            <img
              src={`/api/image/download/${photo[1]}`}
              alt={alt?.[1] || ''}
              title={imgTitle?.[1]}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default VisionSection;