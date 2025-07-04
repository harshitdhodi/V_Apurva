'use client';

import { useState, useEffect } from 'react';
import { FaRegFolder } from 'react-icons/fa6';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import Footer from './layout/Footer';

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
      font-weight: 600;
      margin: 0.8rem 0 0.4rem;
      color: #2d3748;
    }
    .ql-editor h3 {
      font-size: 1.3rem;
      font-weight: 600;
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

export default function SingleBlog({slug}) {
  const [blogData, setBlogData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest news for the slider
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

  // Fetch blog data by slug
  const fetchBlogData = async () => {
    try {
      const response = await fetch(`/api/news/getDataBySlug?slugs=${slug}`);
      const result = await response.json();
      const { productData } = result;
      console.log('Fetched blog data:', productData);
      setBlogData(productData || {});
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
  };

  // Generate meta description from details if no metaDescription is provided
  const metaDescription =
    blogData?.metadescription ||
    (blogData?.details
      ? blogData.details.replace(/<[^>]+>/g, '').substring(0, 160)
      : 'Read the latest blog post on our site.');

  if (loading || !blogData) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
      <div
        className="relative bg-cover bg-white bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/api/image/download/${blogData.photo})` }}
      >
        <div className="flex flex-col   justify-center items-center h-[40vh] md:h-[30vh] mb-10">
          <h1 className="font-bold text-[#bf2e2e] sm:text-2xl md:text-3xl text-xl z-10 text-center">
            {blogData.title}
          </h1>
          <div className="absolute bottom-4 flex space-x-2 z-10">
            <Link href="/blogs" className="hover:text-[#bf2e2e] text-gray-100">
              Blog
            </Link>
            <span className="hover:text-[#bf2e2e] text-gray-100 ">/</span>
            <p className="hover:text-[#bf2e2e] text-gray-100 cursor-pointer">{blogData.title}</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-40 z-1"></div>
        </div>
      </div>

      <div className="lg:flex lg:py-10 bg-white lg:px-16 xl:py-16 xl:px-20">
        <div className="lg:w-2/3">
          <div className="m-5 space-y-5">
            <div>
              <Image
                src={`/api/image/download/${blogData.photo}`}
                width={1200}
                height={600}
                className="rounded w-full"
                alt={blogData.alt?.[0] || 'Blog image'}
                title={blogData.imgTitle?.[0] || blogData.title}
                priority
              />
            </div>
            <p className="text-2xl font-semibold text-[#bf2e2e] font-montserrat">{blogData.title}</p>
            <div className="prose max-w-none">
              <HTMLContent html={blogData.details} className="ql-editor text-black" />
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-16">
          <div className="m-4 shadow-md rounded">
            <div className="p-5 py-10">
              <p className="text-2xl font-semibold text-[#bf2e2e] mb-6 font-montserrat">Latest Post</p>
              <hr className="border-4 rounded w-1/6 border-[#bf2e2e] my-4" />
              <Slider {...settings}>
                {news.map((post) => (
                  <div key={post.id} className="p-4 w-full md:w-full">
                    <div className="relative">
                      <Link href={`/${post.slug}`}>
                        <Image
                          src={`/api/image/download/${post.photo[0]}`}
                          width={400}
                          height={300}
                          alt={post.alt?.[0] || 'Latest post image'}
                          title={post.imgTitle?.[0] || post.title}
                          className="rounded w-full object-cover"
                        />
                      </Link>
                      <p className="flex items-center gap-2 bottom-0 absolute bg-[#bf2e2e] text-white p-2 md:px-4 rounded font-nunito">
                        <FaRegFolder />
                        {post.category}
                      </p>
                    </div>
                    <div className="pt-5 space-y-3">
                      <p className="text-gray-500 font-nunito">{post.date}</p>
                      <Link
                        href={`/${post.slug}`}
                        className="text-gray-800 font-medium text-lg pr-4 font-montserrat"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}