'use client';

import { useState, useEffect } from 'react';
import { Folder, Calendar, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Import Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HTMLContent = ({ html, className = "" }) => {
  const style = `
    .ql-editor {
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5;
      color: #333;
      padding: 0;
      margin: 0;
    }
    .ql-editor h1 {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 1rem 0 0.5rem;
      color: #1a202c;
    }
    .ql-editor h2 {
      font-size: 1.5rem;
      font-weight: 400;
      margin: 0.8rem 0 0.4rem;
      color: #2d3748;
    }
    .ql-editor h3 {
      font-size: 1rem;
      font-weight: 400;
      margin: 0.6rem 0 0.3rem;
      color: #4a5568;
    }
    .ql-editor p {
      margin: 0.5rem 0;
      line-height: 1.6;
    }
    .ql-editor a {
      color: #bf2e2e;
      text-decoration: none;
      transition: color 0.2s;
    }
    .ql-editor a:hover {
      text-decoration: underline;
    }
    .ql-editor ul, .ql-editor ol {
      margin: 0.5rem 0 0.5rem 1.5rem;
      padding: 0;
      list-style-type: disc;
    }
    .ql-editor li {
      margin-bottom: 0.25rem;
    }
    .ql-editor blockquote {
      border-left: 3px solid #bf2e2e;
      padding-left: 0.75rem;
      margin: 0.5rem 0;
      color: #4a5568;
      font-style: italic;
    }
    .ql-editor img {
      max-width: 100%;
      height: auto;
      border-radius: 0.25rem;
      margin: 0.5rem 0;
    }
  `;

  return (
    <>
      <style jsx global>{style}</style>
      <div className={`${className} ql-editor`} dangerouslySetInnerHTML={{ __html: html || "" }} />
    </>
  );
}

// Updated component to accept server-side props
export default function SingleBlog({ 
  initialBlogData, 
  initialLatestNews = [], 
  slug 
}) {
  const [blogData, setBlogData] = useState(initialBlogData || null);
  const [news, setNews] = useState(initialLatestNews.map(newsItem => ({ ...newsItem })));
  const [loading, setLoading] = useState(!initialBlogData);
  const pathname = usePathname();

  // Only fetch data client-side if not provided from server
  useEffect(() => {
    if (!initialBlogData) {
      fetchBlogData();
    }
    if (initialLatestNews.length === 0) {
      fetchNews();
    }
  }, [initialBlogData, initialLatestNews]);

  // Fetch latest news for the slider (fallback)
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/getLatestActiveNews', {
        credentials: 'include',
      });
      const result = await response.json();
      const newsWithIds = result.data.map((newsItem) => ({
        ...newsItem,
      }));
      setNews(newsWithIds);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Fetch blog data by slug (fallback)
  const fetchBlogData = async () => {
    try {
      const currentSlug = slug || pathname.split('/').pop();
      const response = await fetch(`/api/news/getDataBySlug?slugs=${currentSlug}`);
      const result = await response.json();
      const { productData } = result;
      // console.log('Fetched blog data:', productData);
      setBlogData(productData || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setLoading(false);
    }
  };

  // Set the document title when blogData changes
  useEffect(() => {
    if (blogData && blogData.metatitle) {
      document.title = blogData.metatitle;
    } else {
      document.title = 'Blog Post';
    }
  }, [blogData]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    vertical: false,
    adaptiveHeight: true,
    dotsClass: "slick-dots custom-dots",
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-[#bf2e2e] transition-colors"></div>
    ),
  };

  if (loading || !blogData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        
        .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        .slick-track {
          position: relative;
          top: 0;
          left: 0;
          display: flex;
          margin-left: auto;
          margin-right: auto;
        }
        
        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }
        
        .slick-slide.slick-active {
          display: block;
        }
        
        .slick-initialized .slick-slide {
          display: block;
        }
        
        .custom-dots {
          bottom: -40px !important;
          text-align: center;
        }
        
        .custom-dots li {
          margin: 0 4px;
          display: inline-block;
          position: relative;
          cursor: pointer;
        }
        
        .custom-dots li.slick-active div {
          background-color: #bf2e2e !important;
        }
        
        .slick-dots {
          position: absolute;
          bottom: -25px;
          display: block;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style: none;
          text-align: center;
        }
        
        .slick-dots li {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin: 0 5px;
          padding: 0;
          cursor: pointer;
        }
        
        .slick-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 20px;
          height: 20px;
          padding: 5px;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: transparent;
        }
      `}</style>
      
      <div
        className="relative bg-cover bg-white bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https://admin.apurvachemicals.com/api/image/download/${blogData.photo})` }}
      >
        <div className="flex flex-col justify-center items-center h-[40vh] md:h-[40vh] mb-10">
          <div className="absolute space-y-4 space-x-2 z-10">
          <h1 className="font-bold text-[#bf2e2e] sm:text-2xl md:text-3xl text-xl z-10 text-center">
            {blogData.title}
          </h1>
           <div className="flex items-center justify-center space-x-2">
           <Link href="/blogs" className="hover:text-[#bf2e2e] text-gray-100">
              Blog
            </Link>
            <span className="hover:text-[#bf2e2e] text-gray-100">/</span>
            <p className="hover:text-[#bf2e2e] text-gray-100 cursor-pointer">{blogData.title}</p>
          </div>
           </div>
          <div className="absolute inset-0 bg-black opacity-40 z-1"></div>
        </div>
      </div>

      <div className="lg:flex lg:py-10 bg-white lg:px-16 xl:py-16 xl:px-20">
        <div className="lg:w-2/3">
          <div className="m-5 space-y-5">
            <div>
              <Image
                src={`https://admin.apurvachemicals.com/api/image/download/${blogData.photo}`}
                width={1200}
                height={600}
                className="rounded w-full"
                alt={blogData.alt?.[0] || 'Blog image'}
                title={blogData.imgTitle?.[0] || blogData.title}
                priority
              />
            </div>
            <h1 className="text-2xl font-semibold text-[#bf2e2e] font-montserrat">{blogData.title}</h1>
            <div className="prose max-w-none">
              <HTMLContent html={blogData.details} className="ql-editor text-black" />
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-16">
          <div className="m-4 shadow-md rounded">
            <div className="p-5 py-10">
              <h2 className="text-2xl font-semibold text-[#bf2e2e] mb-6 font-montserrat">Latest Post</h2>
              <hr className="border-4 rounded w-1/6 border-[#bf2e2e] my-4" />
              
              {news.length > 0 ? (
                <div className="slider-container">
                  <Slider {...settings}>
                    {news.map((post, index) => (
                      <div key={post.id || index}>
                        <div className="p-2">
                          <div className="relative mb-4">
                            <Link href={`/${post.slug}`}>
                              <Image
                                src={`https://admin.apurvachemicals.com/api/image/download/${post.photo[0] || post.photo}`}
                                width={400}
                                height={300}
                                alt={post.alt?.[0] || 'Latest post image'}
                                title={post.imgTitle?.[0] || post.title}
                                className="rounded w-full object-cover h-48"
                              />
                            </Link>
                            <div className="absolute bottom-2 left-2 bg-[#bf2e2e] text-white px-3 py-1 rounded text-sm font-nunito flex items-center gap-1">
                              <Folder className="w-3 h-3" />
                              {post.category}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-500 font-nunito text-sm">
                              <Calendar className="w-4 h-4" />
                              {post.date}
                            </div>
                            <Link
                              href={`/${post.slug}`}
                              className="text-gray-800 font-medium text-lg font-montserrat hover:text-[#bf2e2e] transition-colors flex items-start gap-2 group"
                            >
                              <span className="flex-1 line-clamp-2">{post.title}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No latest posts available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}