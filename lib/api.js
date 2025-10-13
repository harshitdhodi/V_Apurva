// src/lib/api.js
<<<<<<< HEAD
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3059';
>>>>>>> prod

// Get all possible slugs for static generation
export async function getDynamicRoutes() {
  const defaultResponse = {
    productSlugs: [],
    productCategorySlugs: [],
    newsSlugs: [],
    newsCategorySlugs: []
  };

  try {
    // console.log('Fetching dynamic routes from:', `${API_BASE_URL}/api/dynamicSlug/getAllSlugs`);
    const response = await fetch(`${API_BASE_URL}/api/dynamicSlug/getAllSlugs`, {
      next: { revalidate: 0 }, // Revalidate every hour
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      console.error(`Dynamic routes API returned ${response.status}:`, await response.text());
      return defaultResponse;
    }
    
    const data = await response.json();
    // console.log('Received dynamic routes:', data);
    return data;
  } catch (error) {
    console.error('Error fetching dynamic routes. Using fallback routes.', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    return defaultResponse;
  }
}

// Helper function to fetch with timeout and better error handling
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 5000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {})
      }
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Fetch error for ${url}:`, error.message);
    throw error;
  }
}

export async function getContentBySlug(slug) {
  if (!slug) return { type: 'not-found', data: null };

  // console.log(`Fetching content for slug: ${slug}`);

  try {
    // Try to fetch as product
    try {
      const productRes = await fetchWithTimeout(
        `${API_BASE_URL}/api/product/getDataBySlug?slugs=${encodeURIComponent(slug)}`,
        { 
          next: { revalidate: 60 },
<<<<<<< HEAD
          timeout: 3000 // 3 seconds timeout for product API
=======
          timeout: 3059 // 3 seconds timeout for product API
>>>>>>> prod
        }
      );
      
      if (productRes.ok) {
        const data = await productRes.json();
        if (data?.productData) {
          // console.log(`Found product: ${data.productData.name}`);
          return { type: 'product', data: data.productData };
        }
      }
    } catch (productError) {
      console.warn(`Product fetch failed for ${slug}:`, productError.message);
      // Continue to next attempt
    }

    // Try to fetch as product category
    try {
      const categoryRes = await fetchWithTimeout(
        `${API_BASE_URL}/api/product/getProductsByCategory?categorySlug=${encodeURIComponent(slug)}`,
        { 
<<<<<<< HEAD
          next: { revalidate: 3600 },
          timeout: 3000 // 3 seconds timeout for category API
=======
          next: { revalidate: 0 },
          timeout: 3059 // 3 seconds timeout for category API
>>>>>>> prod
        }
      );
      
      if (categoryRes.ok) {
        const data = await categoryRes.json();
        if (data?.products) {
          // console.log(`Found product category: ${slug}`);
          return { 
            type: 'product-category', 
            data: { 
              name: slug,
              products: data.products 
            } 
          };
        }
      }
    } catch (categoryError) {
      console.warn(`Category fetch failed for ${slug}:`, categoryError.message);
      // Continue to next attempt
    }

    // Try to fetch as news
    try {
      const newsRes = await fetchWithTimeout(
        `${API_BASE_URL}/api/news/getDataBySlug?slugs=${encodeURIComponent(slug)}`,
        { 
          next: { revalidate: 60 },
<<<<<<< HEAD
          timeout: 3000 // 3 seconds timeout for news API
=======
          timeout: 3059 // 3 seconds timeout for news API
>>>>>>> prod
        }
      );
      
      if (newsRes.ok) {
        const data = await newsRes.json();
        if (data?.newsData) {
          // console.log(`Found news: ${data.newsData.title}`);
          return { type: 'blog', data: data.newsData };
        }
      }
    } catch (newsError) {
      console.warn(`News fetch failed for ${slug}:`, newsError.message);
      // Continue to next attempt
    }

    // Try to fetch as news category
    try {
      const newsCategoryRes = await fetchWithTimeout(
        `${API_BASE_URL}/api/news/getSpecificCategoryDetails?categorySlug=${encodeURIComponent(slug)}`,
        { 
<<<<<<< HEAD
          next: { revalidate: 3600 },
          timeout: 3000 // 3 seconds timeout for news category API
=======
          next: { revalidate: 0 },
          timeout: 3059 // 3 seconds timeout for news category API
>>>>>>> prod
        }
      );
      
      if (newsCategoryRes.ok) {
        const data = await newsCategoryRes.json();
        if (data?.category) {
          // console.log(`Found news category: ${data.category.name}`);
          return { 
            type: 'blog-category', 
            data: data.category 
          };
        }
      }
    } catch (newsCategoryError) {
      console.warn(`News category fetch failed for ${slug}:`, newsCategoryError.message);
      // Continue to final return
    }

    // console.log(`No content found for slug: ${slug}`);
    return { type: 'not-found', data: null };

  } catch (error) {
    console.error(`Error in getContentBySlug for ${slug}:`, error);
    return { 
      type: 'error', 
      error: error.message,
      status: error.status || 500
    };
  }
}