'use client';

import { useState, useEffect } from 'react';
import { Folder, Calendar, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SingleBlog() {
  const [blogData, setBlogData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const slug = pathname.split('/').pop();

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/getLatestActiveNews', {
        credentials: 'include',
      });
      const result = await response.json();
      setNews(result.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchBlogData = async () => {
    try {
      const response = await fetch(`/api/news/getDataBySlug?slugs=${slug}`);
      const result = await response.json();
      setBlogData(result.productData || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchNews();
      fetchBlogData();
    }
  }, [slug]);

  useEffect(() => {
    if (blogData?.metatitle) {
      document.title = blogData.metatitle;
    }
  }, [blogData]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    adaptiveHeight: true,
    dotsClass: "slick-dots custom-dots",
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-[#bf2e2e] transition-colors"></div>
    ),
  };

  if (loading || !blogData) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        /* ===== Quill Editor Styles ===== */
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
          color: black;
        }

        .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0.6rem 0 0.3rem;
          color: black;
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

        .ql-editor ul,
        .ql-editor ol {
          margin: 0.5rem 0 0.5rem 6%;
          padding: 0;
        }

        .ql-editor ul {
          list-style-type: disc !important;
        }

        .ql-editor ol {
          list-style-type: decimal !important;
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

        /* ===== Slider Styles ===== */
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
          margin: 0 auto;
        }

        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }

        .slick-slide.slick-active,
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

        /* ===== Hero Section ===== */
        .hero-section {
          position: relative;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40vh;
          margin-bottom: 2.5rem;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .hero-title {
          font-weight: 700;
          color: #bf2e2e;
          font-size: 1.25rem;
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 1.875rem;
          }
        }

        .hero-breadcrumb {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          color: #f3f4f6;
          font-size: 0.95rem;
        }

        .hero-breadcrumb a,
        .hero-breadcrumb p {
          color: inherit;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .hero-breadcrumb a:hover,
        .hero-breadcrumb p:hover {
          color: #bf2e2e;
        }

        /* ===== Blog Container ===== */
        .blog-container {
          background-color: #ffffff;
          padding: 2.5rem 1rem;
        }

        @media (min-width: 768px) {
          .blog-container {
            padding: 2.5rem 4rem;
          }
        }

        @media (min-width: 1280px) {
          .blog-container {
            display: flex;
            padding: 4rem 5rem;
          }
        }

        /* ===== Blog Main Content ===== */
        .blog-main {
          width: 100%;
        }

        @media (min-width: 1280px) {
          .blog-main {
            width: 66.666%;
          }
        }

        .blog-content {
          margin: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .blog-image {
          width: 100%;
          border-radius: 0.25rem;
        }

        .blog-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #bf2e2e;
          font-family: 'Montserrat', sans-serif;
        }

        .blog-details {
          color: #000000;
        }

        /* ===== Blog Sidebar ===== */
        .blog-sidebar {
          margin-top: 4rem;
        }

        @media (min-width: 1280px) {
          .blog-sidebar {
            width: 33.333%;
            margin-top: 0;
            margin-left: 2rem;
          }
        }

        .latest-posts-container {
          margin: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 0.25rem;
        }

        .latest-posts-header {
          padding: 1.25rem 1.25rem 2.5rem;
        }

        .latest-posts-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #bf2e2e;
          margin-bottom: 1.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .latest-posts-divider {
          border: 2px solid #bf2e2e;
          border-radius: 0.25rem;
          width: 16.666%;
          margin: 1rem 0;
        }

        .slider-container {
          position: relative;
        }

        /* ===== Post Card ===== */
        .post-card-wrapper {
          padding: 0.5rem;
        }

        .post-card-image-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .post-card-image {
          width: 100%;
          height: 12rem;
          object-fit: cover;
          border-radius: 0.25rem;
        }

        .post-category-badge {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          background-color: #bf2e2e;
          color: #ffffff;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Nunito', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .post-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-family: 'Nunito', sans-serif;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .post-title-link {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #1f2937;
          font-weight: 500;
          font-size: 1.125rem;
          font-family: 'Montserrat', sans-serif;
          transition: color 0.2s ease;
          text-decoration: none;
        }

        .post-title-link:hover {
          color: #bf2e2e;
        }
.ql-editor p:empty,
.ql-editor p:has(br:only-child) {
  display: none;
}
        .post-title-text {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .post-arrow-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
          transition: transform 0.2s ease;
        }

        .post-title-link:hover .post-arrow-icon {
          transform: translateX(0.25rem);
        }

        .no-posts-message {
          text-align: center;
          padding: 2rem 0;
          color: #9ca3af;
        }
      `}</style>

      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(https://admin.apurvachemicals.com/api/image/download/${blogData.photo})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{blogData.title}</h1>
          <div className="hero-breadcrumb">
            <Link href="/blogs">Blog</Link>
            <span>/</span>
            <p>{blogData.title}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-container">
        {/* Blog Main */}
        <div className="blog-main">
          <div className="blog-content">
            <Image
              src={`https://admin.apurvachemicals.com/api/image/download/${blogData.photo}`}
              width={1200}
              height={600}
              className="blog-image"
              alt={blogData.alt?.[0] || 'Blog image'}
              title={blogData.imgTitle?.[0] || blogData.title}
              priority
            />
            <p className="blog-title">{blogData.title}</p>
            <div className="blog-details ql-editor" dangerouslySetInnerHTML={{ __html: blogData.details || "" }} />
          </div>
        </div>

        {/* Blog Sidebar */}
        <div className="blog-sidebar">
          <div className="latest-posts-container">
            <div className="latest-posts-header">
              <p className="latest-posts-title">Latest Post</p>
              <hr className="latest-posts-divider" />

              {news.length > 0 ? (
                <div className="slider-container">
                  <Slider {...sliderSettings}>
                    {news.map((post) => (
                      <div key={post.id}>
                        <div className="post-card-wrapper">
                          <div className="post-card-image-container">
                            <Link href={`/${post.slug}`}>
                              <Image
                                src={`https://admin.apurvachemicals.com/api/image/download/${post.photo[0] || post.photo}`}
                                width={400}
                                height={300}
                                alt={post.alt?.[0] || 'Latest post image'}
                                title={post.imgTitle?.[0] || post.title}
                                className="post-card-image"
                              />
                            </Link>
                            <div className="post-category-badge">
                              <Folder className="w-3 h-3" />
                              {post.category}
                            </div>
                          </div>
                          <div className="post-date">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </div>
                          <Link href={`/${post.slug}`} className="post-title-link">
                            <span className="post-title-text">{post.title}</span>
                            <ArrowRight className="post-arrow-icon" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="no-posts-message">No latest posts available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}