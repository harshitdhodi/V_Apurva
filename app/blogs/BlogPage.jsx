// src/app/blogs/BlogClient.jsx (Client Component with Click Tracking)
'use client';

import { useState, useMemo } from 'react';
import { Eye, Search, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useClickTracking } from '@/lib/useClickTracking';

export default function BlogClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { trackEvent } = useClickTracking();

  const { blogs = [], categories = [], banners = [] } = initialData || {};

  const filteredBlogs = useMemo(() => {
    return (blogs || []).filter(blog => {
      if (!blog) return false;
      const trimmedQuery = (searchQuery || '').trim().toLowerCase();
      const matchesSearch = blog.title?.toLowerCase().includes(trimmedQuery);
      const matchesCategory = selectedCategory === 'All' || 
        blog.categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Track search input
    if (query.trim().length > 0) {
      trackEvent('button_click', {
        buttonName: 'blog_search',
        metadata: {
          searchQuery: query,
          page: 'blogs',
          action: 'search',
          resultsFound: filteredBlogs.length
        }
      });
    }
  };

  const handleCategoryFilter = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);

    // Track category filter click
    trackEvent('button_click', {
      buttonName: 'blog_category_filter',
      metadata: {
        category: categoryName || categoryId,
        categoryId: categoryId,
        page: 'blogs',
        action: 'filter_by_category',
        resultsFound: filteredBlogs.filter(blog => {
          const matchesCategory = categoryId === 'All' || 
            blog.categories?.includes(categoryId);
          return matchesCategory;
        }).length
      }
    });
  };

  const handleBlogCardClick = (blogSlug, blogTitle) => {
    // Track blog card click
    trackEvent('button_click', {
      buttonName: 'blog_card_click',
      metadata: {
        blogTitle: blogTitle,
        blogSlug: blogSlug,
        page: 'blogs',
        action: 'navigate_to_blog'
      }
    });
  };

  const handleBlogImageClick = (blogSlug, blogTitle) => {
    // Track blog image click
    trackEvent('button_click', {
      buttonName: 'blog_image_click',
      metadata: {
        blogTitle: blogTitle,
        blogSlug: blogSlug,
        page: 'blogs',
        action: 'click_image'
      }
    });
  };

  const handleBlogTitleClick = (blogSlug, blogTitle) => {
    // Track blog title click
    trackEvent('button_click', {
      buttonName: 'blog_title_click',
      metadata: {
        blogTitle: blogTitle,
        blogSlug: blogSlug,
        page: 'blogs',
        action: 'click_title'
      }
    });
  };

  const handleReadMoreClick = (blogSlug, blogTitle) => {
    // Track read more button click
    trackEvent('button_click', {
      buttonName: 'blog_read_more',
      metadata: {
        blogTitle: blogTitle,
        blogSlug: blogSlug,
        page: 'blogs',
        action: 'read_more'
      }
    });
  };

  const handleBreadcrumbClick = (breadcrumbName) => {
    // Track breadcrumb navigation
    trackEvent('button_click', {
      buttonName: 'blog_breadcrumb_click',
      metadata: {
        breadcrumb: breadcrumbName,
        page: 'blogs',
        action: 'breadcrumb_navigation'
      }
    });
  };

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
      <main className="bg-white min-h-screen">
        {/* Banner Section */}
        <div>
          {banners.map((banner, index) => (
            <div key={index} className="relative">
              <div
                className="banner-background bg-white relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_ADMIN_API_URL}/api/image/download/${banner.photo})` }}
                title={banner.title}
              >
                <div className='flex justify-center items-center h-[40vh] md:h-[30vh]'>
                  <h1 className='font-semibold text-white sm:text-2xl md:text-3xl text-xl z-10'>
                    {banner.title}
                  </h1>
                  <div className="absolute bottom-16 flex space-x-2 z-10">
                    <Link 
                      href="/" 
                      className="text-white hover:text-gray-300"
                      onClick={() => handleBreadcrumbClick('home')}
                    >
                      Home
                    </Link>
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
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg placeholder:text-[#646060] focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] text-[#bf2e2e] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#646060]" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleCategoryFilter('All', 'All')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'All' 
                  ? 'bg-[#bf2e2e] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-[#bf2e2e]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryFilter(category._id, category.category)}
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
              <article key={post._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col bg-white">
                {/* Thumbnail Image with Unified Style */}
                <div className="h-48 overflow-hidden bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] relative">
                  <Link href={`/${post.slug}`} onClick={() => handleBlogImageClick(post.slug, post.title)}>
                    <div className="w-full h-full relative">
                      <Image
                        src={`https://admin.apurvachemicals.com/api/image/download/${post.photo?.[0]}`}
                        alt={post.alt?.[0] || post.title}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                      {/* Subtle overlay for brand consistency */}
                      <div className="absolute inset-0 bg-black opacity-5 hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Author and Date Section - Improved Contrast */}
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                    <UserCircle className="text-[#bf2e2e] flex-shrink-0" size={24} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {post.postedBy || 'Admin'}
                      </p>
                      <time className="text-xs text-gray-700 font-medium block">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Blog Title */}
                  <h3 className="font-semibold mb-3 flex-grow">
                    <Link 
                      href={`/${post.slug}`}
                      onClick={() => handleBlogTitleClick(post.slug, post.title)}
                      className="hover:text-[#bf2e2e] text-gray-900 text-base transition-colors duration-200 line-clamp-3"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Read More Button */}
                 <div className="flex items-center space-x-3 justify-between">
                   <Link
                    href={`/${post.slug}`}
                    onClick={() => handleReadMoreClick(post.slug, post.title)}
                    className="inline-flex items-center text-[#bf2e2e] font-semibold mt-auto hover:text-[#a02424] transition-colors duration-200 group"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
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
                  <div className="flex items-center space-x-2">
                    <Eye className="text-[#bf2e2e] flex-shrink-0" size={24} />
                    <p className="text-gray-700">{post.visits || 0}</p>
                  </div>
                 </div>
                </div>
              </article>
            ))}
          </div>

          {/* No results message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-700">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}