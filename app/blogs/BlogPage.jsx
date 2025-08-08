// src/app/blogs/BlogClient.jsx (Client Component)
'use client';

import { useState, useMemo } from 'react';
import { Search, UserCircle, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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

  // Format date for better readability
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  // Extract excerpt from content
  const getExcerpt = (content, maxLength = 120) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Blog Posts Found</h2>
            <p className="text-gray-600">We're working on bringing you fresh content. Please check back soon!</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-[#bf2e2e] text-white rounded-lg hover:bg-[#a02626] transition-colors"
          >
            Return to Homepage
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section */}
      {banners.map((banner, index) => (
        <section key={index} className="relative">
          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://admin.apurvachemicals.com/api/image/download/${banner.photo})` }}
            role="banner"
            aria-label={banner.title}
          >
            <div className="flex justify-center items-center h-[40vh] md:h-[30vh] relative">
              <div className="text-center z-10">
                <h1 className="font-semibold text-white sm:text-2xl md:text-3xl text-xl mb-4">
                  {banner.title}
                </h1>
                <nav aria-label="Breadcrumb" className="flex justify-center items-center space-x-2 text-white">
                  <Link href="/" className="hover:text-gray-300 transition-colors">
                    Home
                  </Link>
                  <span>/</span>
                  <span className="font-medium">{banner.title}</span>
                </nav>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </div>
        </section>
      ))}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-6">
              <label htmlFor="blog-search" className="sr-only">
                Search blog posts
              </label>
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf2e2e] focus:border-transparent transition-colors"
                aria-describedby="search-description"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <p id="search-description" className="sr-only">
                Search through our blog posts by title or content
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === 'All' 
                    ? 'bg-[#bf2e2e] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
                aria-pressed={selectedCategory === 'All'}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category._id 
                      ? 'bg-[#bf2e2e] text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  aria-pressed={selectedCategory === category._id}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBlogs.map((post, index) => (
              <article 
                key={post._id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                itemScope 
                itemType="https://schema.org/BlogPosting"
              >
                {/* Article Image */}
                <div className="h-48 overflow-hidden">
                  <Link href={`/${post.slug}`} className="block h-full">
                    <Image
                      src={`https://admin.apurvachemicals.com/api/image/download/${post.photo?.[0]}`}
                      alt={post.alt?.[0] || post.title || 'Blog post image'}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      itemProp="image"
                      priority={index < 4} // Prioritize loading for first 4 images
                    />
                  </Link>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Author and Date */}
                  <div className="flex items-center space-x-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span itemProp="author">{post.postedBy || 'Admin'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <time 
                        dateTime={post.date} 
                        itemProp="datePublished"
                        className="text-gray-500"
                      >
                        {formatDate(post.date)}
                      </time>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2" itemProp="headline">
                    <Link 
                      href={`/${post.slug}`} 
                      className="hover:text-[#bf2e2e] text-gray-800 transition-colors duration-200"
                      itemProp="url"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Article Excerpt */}
                  {post.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3" itemProp="description">
                      {getExcerpt(post.description)}
                    </p>
                  )}

                  {/* Read More Link */}
                  <Link
                    href={`/${post.slug}`}
                    className="inline-flex items-center text-[#bf2e2e] font-medium hover:text-[#a02626] transition-colors duration-200 group"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Hidden structured data */}
                <div className="sr-only">
                  <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">Apurva Chemicals</span>
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* No Results Message */}
          {filteredBlogs.length === 0 && (searchQuery || selectedCategory !== 'All') && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any articles matching your criteria. Try adjusting your search or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="inline-flex items-center px-6 py-3 bg-[#bf2e2e] text-white rounded-lg hover:bg-[#a02626] transition-colors"
                >
                  Clear Filters
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Blog Stats (for SEO) */}
        <section className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Stay Updated with Industry Insights
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our collection of {blogs.length} articles covering industry trends, 
              product innovations, and expert insights in the chemical sector.
            </p>
            {categories.length > 0 && (
              <p className="text-sm text-gray-500">
                Topics include: {categories.slice(0, 5).map(cat => cat.category).join(', ')}
                {categories.length > 5 && ' and more'}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}