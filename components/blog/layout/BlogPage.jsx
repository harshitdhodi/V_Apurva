import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaRegUserCircle } from "react-icons/fa";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchBanners();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`/api/news/getActiveNews`, { withCredentials: true });
      setBlogs(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banner/getBannersBySectionBlog', { withCredentials: true });
      setBanners(response.data.data);
      // console.log(response.data.data)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/news/getSpecificCategoryDetails`, { withCredentials: true });
      setCategories(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredBlogs = blogs.filter(blog => {
   
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if selectedCategory is 'All' or blog.categories includes the selected category
    const matchesCategory = selectedCategory === 'All' || blog.categories.includes(selectedCategory);
  
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div>

        {banners.map((banner, index) => (
          <>
            <style>
              {`
              .banner-background {
               background-image:url(/api/image/download/${banner.photo})
           `}
            </style>
            <div
              key={index}
              className=' banner-background relative bg-cover bg-center bg-no-repeat'
              title={banner.title}
            >
              <div className='flex justify-center items-center h-[40vh] md:h-[30vh]'>
                <h1 className='font-semibold text-white sm:text-2xl md:text-3xl text-xl z-10 '>{banner.title}</h1>
                <div className="absolute bottom-16 flex space-x-2 z-10">
                  <Link to="/" className="text-white hover:text-gray-300 ">Home</Link>
                  <span className="text-white">/</span>
                  <a href="#" className="text-white hover:text-gray-300  cursor-pointer ">{banner.title}</a>
                </div>
                <div className='absolute inset-0 bg-black opacity-40 z-1'></div>
              </div>
            </div>
          </>
        ))}
      </div>

      <p className='text-center w-[80%] font-semibold mx-auto'>{categories.description}</p>

      <div className=' mb-8 m-4 md:mx-20 md:mt-10'>
        <div className="flex items-center py-2">
          <input
            className="font-nunito appearance-none bg-white border border-gray-300 w-full text-gray-700 py-4 px-6 leading-tight focus:outline-none rounded-full"
            type="text"
            placeholder="Search..."
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4 p-4 md:px-20">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-4 py-2 mr-2 font-semibold rounded shadow-md ${selectedCategory === 'All' ? 'bg-primary text-white' : ' text-black hover:border-b-[4px]  border-b-primary'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryChange(category._id)}
            className={`px-4 py-2 mr-2 font-semibold rounded shadow-md ${selectedCategory === category._id ? 'bg-primary text-white' : ' text-black hover:border-b-[4px]  border-b-primary'}`}
          >
            {category.category}
          </button>
        ))}
      </div>

      <div className="mx-auto p-4 md:px-20 w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map((post, index) => (
            <div key={index} className="relative border rounded-lg overflow-hidden group hover:shadow-lg">
              <div className='overflow-hidden'>
                <Link to={`/${post.slug}`}>
                  <img
                    src={`/api/image/download/${post.photo[0]}`}
                    alt={post.alt[0]}
                    title={post.imgTitle[0]}
                    className="w-full h-48 object-cover group-hover:scale-110 duration-300 rounded-t-lg"
                  />
                </Link>
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center space-x-3 text-gray-600 mb-3">
                  <FaRegUserCircle size={24} />
                  <div>
                    <p className="font-semibold capitalize">{post.postedBy}</p>
                    <p className="text-gray-500 text-sm">{post.date}</p>
                  </div>
                </div>
                <Link to={`/${post.slug}`} className="text-lg font-semibold text-gray-900 hover:text-primary capitalize cursor-pointer">{post.title}</Link>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/${post.slug}`}
                    className="text-primary font-bold hover:text-secondary"
                  >
                    Read more {'>'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BlogPage;
