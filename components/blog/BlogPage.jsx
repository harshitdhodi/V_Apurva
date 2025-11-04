import Link from "next/link"
import { ArrowRight, UserCircle } from "lucide-react"
import Image from "next/image"

// Server-side data fetching
async function getBlogData() {
  try {
    const [headingResponse, blogsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHeading/heading?pageType=news`, {
        
        next: { revalidate: 0 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/getActiveNewsList`, {
        
        next: { revalidate: 0 },
      }),
    ])

    const headingData = headingResponse.ok ? await headingResponse.json() : {}
    const blogsData = blogsResponse.ok ? await blogsResponse.json() : {}

    return {
      heading: headingData.heading || "",
      subheading: headingData.subheading || "",
      blogs: Array.isArray(blogsData.data) ? blogsData.data : Array.isArray(blogsData) ? blogsData : [],
    }
  } catch (error) {
    console.error("Error fetching blog data:", error)
    return {
      heading: "",
      subheading: "",
      blogs: [],
    }
  }
}

export default async function BlogPage() {
  const { heading, subheading, blogs } = await getBlogData()

  return (
    <div>
      <div className='md:px-20 p-4 bg-white pt-16'>
        <p className='text-[#bf2e2e] md:text-[20px] font-bold pb-8 uppercase text-center md:text-left'>{heading}</p>
        <div className='py-4 lg:flex lg:items-center lg:justify-between gap-2'>
          <h2 className='text-3xl sm:text-4xl text-gray-800 font-sans font-bold text-center md:text-left'>{subheading}</h2>
          <p className='py-3 text-gray-500 font-semibold text-center md:text-left flex flex-wrap gap-2'>
            Explore Fresh Perspectives on Products and Industry Innovations. 
            <Link href="/blogs" className='flex items-center  gap-2 text-[#bf2e2e] font-semibold'>
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto p-4 md:px-20 w-full bg-white pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { blogs.map((post, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden group hover:shadow-lg">
                <div className='overflow-hidden'>
                  <Link href={`/${post?.slug || ''}`}>
                    <div className="relative  w-full h-48">
                      <Image
                        src={post?.photo?.[0] ? `https://admin.apurvachemicals.com/api/image/download/${post.photo[0]}` : '/placeholder-image.jpg'}
                        alt={post?.alt?.[0] || post?.title || 'Blog post image'}
                        title={post?.imgTitle?.[0] || post?.title || ''}
                        width={378}
                        height={270}
                        loading="lazy"
                        className="object-fill md:object-contain group-hover:scale-110 duration-300 "
                       
                      />
                    </div>
                  </Link>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center space-x-3 text-gray-600 mb-3">
                    <UserCircle className="h-6 w-6" />
                    <div>
                      <p className="font-semibold capitalize">{post?.postedBy || 'Admin'}</p>
                      <p className="text-gray-500 text-sm">{post?.date || ''}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/${post?.slug || ''}`} 
                    className="text-lg font-semibold text-gray-900 hover:text-[#bf2e2e] capitalize cursor-pointer line-clamp-2"
                  >
                    {post?.title || 'Untitled Post'}
                  </Link>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/${post?.slug || ''}`}
                      className="text-[#bf2e2e] font-bold hover:text-[#cd1d1d] hover:underline flex items-center gap-1"
                    >
                      Read more <ArrowRight className="h-4 w-4 inline" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
