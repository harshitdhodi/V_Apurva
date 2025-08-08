// src/app/blogs/BlogServerContent.jsx (Server Component)
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Calendar, ArrowRight } from 'lucide-react';

export default function BlogServerContent({ data }) {
  const { blogs = [], categories = [], banners = [] } = data || {};

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
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Blog Posts Found</h2>
          <p className="text-gray-600">We're working on bringing you fresh content. Please check back soon!</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-[#bf2e2e] text-white rounded-lg hover:bg-[#a02626] transition-colors mt-4"
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
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Apurva Chemicals Blog",
            "description": "Latest news, insights & industry updates from Apurva Chemicals",
            "url": "https://apurvachemicals.com/blogs",
            "publisher": {
              "@type": "Organization",
              "name": "Apurva Chemicals",
              "url": "https://apurvachemicals.com"
            },
            "blogPost": blogs.slice(0, 10).map(blog => ({
              "@type": "BlogPosting",
              "headline": blog.title,
              "description": getExcerpt(blog.description),
              "url": `https://apurvachemicals.com/${blog.slug}`,
              "datePublished": blog.date,
              "author": {
                "@type": "Person",
                "name": blog.postedBy || "Admin"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Apurva Chemicals"
              },
              "image": blog.photo?.[0] ? `https://admin.apurvachemicals.com/api/image/download/${blog.photo[0]}` : null
            }))
          })
        }}
      />

      {/* Banner Section - Server Rendered */}
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

      {/* Server-rendered blog content for SEO */}
      <main className="container mx-auto px-4 py-8">
        {/* Static content for search engines */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Industry Insights</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of {blogs.length} articles covering industry trends, 
            product innovations, and expert insights in the chemical sector.
          </p>
        </section>

        {/* Server-rendered blog grid for SEO */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.map((post, index) => (
              <article 
                key={`server-${post._id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                itemScope 
                itemType="https://schema.org/BlogPosting"
              >
                <div className="h-48 overflow-hidden">
                  <Link href={`/${post.slug}`} className="block h-full">
                    <Image
                      src={`https://admin.apurvachemicals.com/api/image/download/${post.photo?.[0]}`}
                      alt={post.alt?.[0] || post.title || 'Blog post image'}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover"
                      itemProp="image"
                      priority={index < 4}
                    />
                  </Link>
                </div>

                <div className="p-6">
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

                  <h3 className="text-xl font-semibold mb-3" itemProp="headline">
                    <Link 
                      href={`/${post.slug}`} 
                      className="hover:text-[#bf2e2e] text-gray-800 transition-colors duration-200"
                      itemProp="url"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {post.description && (
                    <p className="text-gray-600 mb-4" itemProp="description">
                      {getExcerpt(post.description)}
                    </p>
                  )}

                  <Link
                    href={`/${post.slug}`}
                    className="inline-flex items-center text-[#bf2e2e] font-medium hover:text-[#a02626] transition-colors duration-200"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>

                <div className="sr-only">
                  <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">Apurva Chemicals</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories for SEO */}
        <section className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Browse by Category</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Link
                key={`server-cat-${category._id}`}
                href={`/blogs?category=${category._id}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                {category.category}
              </Link>
            ))}
          </div>
          {categories.length > 0 && (
            <p className="text-sm text-gray-500">
              Topics include: {categories.slice(0, 5).map(cat => cat.category).join(', ')}
              {categories.length > 5 && ' and more'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}