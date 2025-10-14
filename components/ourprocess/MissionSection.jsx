"use client";

function MissionSection({ data }) {
  const { title, description, photo, alt, imgTitle } = data;

  return (
    <section className="w-full py-5">
      <div className="md:mx-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          {description && (
            <div 
              className="prose max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl text-justify text-gray-600"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 md:mt-0">
          {photo?.[0] && (
            <img
              src={`/api/image/download/${photo[0]}`}
              alt={alt?.[0] || ''}
              title={imgTitle?.[0]}
              className="rounded-xl shadow-md object-cover h-64 w-full"
            />
          )}
          {photo?.[1] && (
            <img
              src={`/api/image/download/${photo[1]}`}
              alt={alt?.[1] || ''}
              title={imgTitle?.[1]}
              className="rounded-xl shadow-md object-cover h-64 w-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default MissionSection;