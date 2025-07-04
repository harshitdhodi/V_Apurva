'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

// Skeleton Component for Loading State
const SkeletonCard = () => (
  <div className="border rounded-lg overflow-hidden animate-pulse bg-gray-200">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-6">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
        <div className="w-24 h-4 bg-gray-400"></div>
      </div>
      <div className="mt-3 w-3/4 h-4 bg-gray-400"></div>
      <div className="mt-2 w-1/2 h-4 bg-gray-400"></div>
    </div>
  </div>
);

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    fetchHeadings();
  }, []);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/news/getLatestActiveNews`);
      const data = response.data?.data || [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=news');
      setHeading(response.data?.heading || '');
      setSubheading(response.data?.subheading || '');
    } catch (error) {
      console.error("Error fetching headings:", error);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className='md:px-20 p-4 bg-white pt-16'>
        <p className='text-blue-600 md:text-[20px] font-bold pb-8 uppercase text-center md:text-left'>{heading}</p>
        <div className='py-4 lg:flex lg:items-center lg:justify-between gap-2'>
          <h2 className='text-3xl sm:text-4xl text-gray-800 font-bold text-center md:text-left'>{subheading}</h2>
          <p className='py-3 text-gray-500 font-semibold flex flex-wrap gap-2'>
            Explore Fresh Perspectives on Products and Industry Innovations. 
            <Link href="/blogs" className='flex items-center gap-2 text-blue-600 font-semibold'>
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto p-4 md:px-20 w-full bg-white pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Show skeletons when loading
            [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
          ) : (
            filteredBlogs.map((post, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden group hover:shadow-lg">
                <div className='overflow-hidden'>
                  <Link href={`/${post?.slug || ''}`}>
                    <div className="relative w-full h-48">
                      <Image
                        src={post?.photo?.[0] ? `/api/image/download/${post.photo[0]}` : '/placeholder-image.jpg'}
                        alt={post?.alt?.[0] || post?.title || 'Blog post image'}
                        title={post?.imgTitle?.[0] || post?.title || ''}
                        fill
                        className="object-cover group-hover:scale-110 duration-300 rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={index < 4} // Only preload first 4 images
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
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 capitalize cursor-pointer line-clamp-2"
                  >
                    {post?.title || 'Untitled Post'}
                  </Link>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/${post?.slug || ''}`}
                      className="text-blue-600 font-bold hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      Read more <ArrowRight className="h-4 w-4 inline" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
