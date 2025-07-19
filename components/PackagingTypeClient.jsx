// components/PackagingTypeClient.js (Client Component)
"use client"

function PackagingTypeClient({ data }) {
  const { description, heading, subheading, heading2, subheading2, packagingTypes } = data

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    e.target.nextElementSibling?.classList.remove('hidden')
  }

  return (
    <div className="p-4 md:px-16 py-16 bg-gray-100">
      <p className='md:text-[20px] text-[#bf2e2e] font-bold mb-4 uppercase  text-center md:text-left'>
        {heading ? `____${heading}` : ''}
      </p>
      <p className="sm:text-4xl text-3xl font-daysOne mb-6 text-center font-bold md:text-left text-gray-800">
        {subheading}
      </p>
      
      {description && (
        <div 
          className="md:text-[20px] text-black mb-8 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {heading2 && (
        <p className='md:text-2xl text-xl font-daysOne mb-6 font-bold text-gray-800'>
          {heading2}
        </p>
      )}

      {packagingTypes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {packagingTypes.map((item, index) => (
            <div key={item._id || index} className="text-center">
              <div className='overflow-hidden rounded-md bg-white p-2 shadow-sm'>
                <div className="relative h-48 w-full">
                  <img 
                    src={item.photo ? `/api/logo/download/${item.photo}` : '/placeholder-image.jpg'} 
                    alt={item.alt || item.title} 
                    title={item.imgTitle || item.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    onError={handleImageError}
                  />
                </div>
                {item.title && (
                  <p className='md:text-[18px] text-[#bf2e2e] font-bold uppercase mt-3'>
                    {item.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No packaging types available</p>
      )}

      {subheading2 && (
        <p className='md:text-[20px] text-black'>{subheading2}</p>
      )}
    </div>
  )
}

export default PackagingTypeClient