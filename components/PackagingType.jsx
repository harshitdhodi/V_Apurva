'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

function PackagingType() {
    const [description, setDescription] = useState("");
    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [heading2, setHeading2] = useState("");
    const [subheading2, setSubheading2] = useState("");
    const [packagingTypes, setPackagingTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPackagingDetail = async () => {
        try {
            const response = await axios.get('/api/packagingdetail/getPackagingDetail');
            const packagingdetail = response.data;
            setDescription(packagingdetail?.description || "");
            setHeading(packagingdetail?.heading || "");
            setSubheading(packagingdetail?.subheading || "");
        } catch (error) {
            console.error('Error fetching packaging details:', error);
            setError('Failed to load packaging details');
        }
    };

    const fetchHeadings = async () => {
        try {
            const response = await axios.get('/api/pageHeading/heading?pageType=packagingType');
            const { heading, subheading } = response.data;
            setHeading2(heading || '');
            setSubheading2(subheading || '');
        } catch (error) {
            console.error('Error fetching headings:', error);
            setError('Failed to load headings');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/packaging-types');
            setPackagingTypes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching packaging types:', error);
            setError('Failed to load packaging types');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackagingDetail();
        fetchHeadings();
        fetchData();
    }, []);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling?.classList.remove('hidden');
    };

    if (error) {
        return (
            <div className="p-4 md:px-16 py-16 bg-gray-100 text-center">
                <p className="text-red-500">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:px-16 py-16 bg-gray-100">
            <p className='md:text-[20px] text-[#bf2e2e] font-bold mb-4 uppercase text-center md:text-left'>
                {heading ? `____${heading}` : ''}
            </p>
            <p className="sm:text-4xl text-3xl font-daysOne mb-6 text-center md:text-left text-gray-800">
                {subheading}
            </p>
            
            {description && (
                <div 
                    className="md:text-[20px] mb-8 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            {heading2 && (
                <p className='md:text-2xl text-xl font-daysOne mb-6 text-gray-800'>
                    {heading2}
                </p>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf2e2e]"></div>
                </div>
            ) : packagingTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {packagingTypes.map((item, index) => (
                        <div key={item._id || index} className="text-center">
                            <div className='overflow-hidden rounded-md bg-white p-2 shadow-sm'>
                                <div className="relative h-48 w-full">
                                    <img 
                                        src={item.photo ? `/api/logo/download/${item.photo}` : '/placeholder-image.jpg'} 
                                        alt={item.alt || item.title} 
                                        title={item.imgTitle || item.title}
                                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                        onError={handleImageError}
                                    />
                                </div>
                                {item.title && (
                                    <p className='md:text-[18px] text-[#bf2e2e] font-bold uppercase mt-3'>
                                        {item.title}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">No packaging types available</p>
            )}

            {subheading2 && (
                <p className='md:text-[20px] text-gray-700'>{subheading2}</p>
            )}
        </div>
    );
}

export default PackagingType;
