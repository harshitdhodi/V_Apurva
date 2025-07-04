'use client';

import { useEffect, useMemo, Suspense } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { makeStore } from '@/redux/store';
import { setBlogs, setCategories, setBanners, setSearchQuery, setSelectedCategory } from '@/redux/slices/blogSlice';
import { Search, UserCircle } from 'lucide-react';
import Link from 'next/link'; // Add this import
import dynamic from 'next/dynamic';

// Lazy load heavy components
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

// Client-side only component
function BlogContent({ initialData }) {
  const dispatch = useDispatch();
  const { blogs = [], categories = [], banners = [], searchQuery = '', selectedCategory = 'All' } = 
    useSelector((state) => state.blog) || {};

  // Initialize with server data
  useEffect(() => {
    if (initialData) {
      dispatch(setBlogs(initialData.blogs || []));
      dispatch(setCategories(initialData.categories || []));
      dispatch(setBanners(initialData.banners || []));
    }
  }, [initialData, dispatch]);

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
      <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
          <p>Please check back later or try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
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

        {/* Rest of your JSX */}
        <div className="container mx-auto px-4 py-8">
          {/* Search and filter section */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => dispatch(setSelectedCategory('All'))}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'All' ? 'bg-[#bf2e2e] text-white' : 'bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => dispatch(setSelectedCategory(category._id))}
                className={`px-4 py-2 rounded-full shadow-md ${
                  selectedCategory === category._id ? 'bg-[#bf2e2e] text-white' : 'bg-gray-100  text-[#bf2e2e]'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBlogs.map((post) => (
              <div key={post._id} className="border rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <Link href={`/${post.slug}`}>
                    <img
                      src={`/api/image/download/${post.photo?.[0]}`}
                      alt={post.alt?.[0] || post.title}
                      className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <UserCircle className="text-gray-400" size={24} />
                    <div>
                      <p className="font-sm text-gray-600">{post.postedBy || 'Admin'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/${post.slug}`} className="hover:text-[#bf2e2e] text-black text-lg">
                      {post.title}
                    </Link>
                  </h3>
                  <Link
                    href={`/${post.slug}`}
                    className="inline-flex items-center text-[#bf2e2e] font-medium mt-4"
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
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Main component that wraps with Redux Provider
export default function BlogPage({ initialData }) {
  const store = useMemo(() => makeStore(), []);
  
  return (
    <Provider store={store}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <BlogContent initialData={initialData} />
      </Suspense>
    </Provider>
  );
}