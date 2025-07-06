// src/app/blogs/BlogClient.jsx (Client Component)
'use client';

import { useState, useMemo } from 'react';
import { Search, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function BlogClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { blogs = [], categories = [], banners = [] } = initialData || {};

  const filteredBlogs = useMemo(() => {
    return (blogs || []).filter(blog => {
      if (!blog) return false;
      const matchesSearch = blog.title?.toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesCategory = selectedCategory === 'All' || 
        blog.categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
          <p>Please check back later or try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="bg-white min-h-screen">
        {/* Banner Section */}
        <div>
          {banners.map((banner, index) => (
            <div key={index} className="relative">
              <div
                className="banner-background bg-white relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(/api/image/download/${banner.photo})` }}
                title={banner.title}
              >
                <div className='flex justify-center items-center h-[40vh] md:h-[30vh]'>
                  <h1 className='font-semibold text-white sm:text-2xl md:text-3xl text-xl z-10'>
                    {banner.title}
                  </h1>
                  <div className="absolute bottom-16 flex space-x-2 z-10">
                    <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                    <span className="text-white">/</span>
                    <span className="text-white hover:text-gray-300 cursor-pointer">
                      {banner.title}
                    </span>
                  </div>
                  <div className='absolute inset-0 bg-black opacity-40 -z-1'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Search and filter section */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'All' 
                  ? 'bg-[#bf2e2e] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-full shadow-md transition-colors ${
                  selectedCategory === category._id 
                    ? 'bg-[#bf2e2e] text-white' 
                    : 'bg-gray-100 text-[#bf2e2e] hover:bg-gray-200'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBlogs.map((post) => (
              <article key={post._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <Link href={`/${post.slug}`}>
                    <Image
                      src={`/api/image/download/${post.photo?.[0]}`}
                      alt={post.alt?.[0] || post.title}
                      width={500}
                      height={500}
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <UserCircle className="text-gray-400" size={24} />
                    <div>
                      <p className="font-sm text-gray-600">{post.postedBy || 'Admin'}</p>
                      <time className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link 
                      href={`/${post.slug}`} 
                      className="hover:text-[#bf2e2e] text-black text-lg transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <Link
                    href={`/${post.slug}`}
                    className="inline-flex items-center text-[#bf2e2e] font-medium mt-4 hover:underline"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* No results message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}