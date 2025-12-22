import { useState, useEffect } from 'react';

export default function FAQSection({ productId }) {
    console.log('FAQSection Product ID:', productId);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/faq?productId=${productId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch FAQs');
                }

                const result = await response.json();
                
                // Filter active FAQs and sort by order
                const activeFaqs = (result.data || [])
                    .filter(faq => faq.isActive)
                    .sort((a, b) => a.order - b.order);
                
                setFaqs(activeFaqs);
                setError(null);
            } catch (err) {
                console.error('Error fetching FAQs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, [productId]);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    // Don't render section if there are no FAQs
    if (loading) {
        return (
            <div className="max-w-7xl pt-16">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                </div>
            </div>
        );
    }

    if (error || faqs.length === 0) {
        return null; // Don't show anything if there's an error or no FAQs
    }

    return (
        <div className="max-w-7xl pt-16">
            <h2 className="text-xl md:text-2xl font-bold text-left mb-4 text-gray-800">
                Frequently Asked Questions
            </h2>
            <p className="text-left text-gray-600 mb-10 max-w-4xl">
                Find answers to common questions about this product
            </p>

            {/* FAQ List */}
            <div className="space-y-4 mb-12">
                {faqs.map((faq, index) => (
                    <div 
                        key={faq._id} 
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-lg font-semibold text-gray-800 pr-4">
                                {faq.question}
                            </span>
                            <div 
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                                style={{ backgroundColor: '#bf2e2e' }}
                            >
                                {expandedQuestion === index ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5 10h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5 10h10M10 5v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                        </button>

                        {expandedQuestion === index && (
                            <div className="px-6 pb-6 opacity-0 -translate-y-2 animate-[fadeIn_0.3s_ease-out_forwards]">
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}