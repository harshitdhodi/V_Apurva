const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3023';

// Helper function to create a fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

async function getFaviconPath() {
  try {
    const response = await fetchWithTimeout(
      `${baseUrl}/api/logo/getfavicon`,
      { 
        next: { revalidate: 60 }, // Cache for 1 hour
        credentials: 'include',
      },
      3000 // 3 second timeout
    );
    
    if (!response.ok) {
      console.warn('Failed to fetch favicon:', response.status, response.statusText);
      return '/favicon.ico';
    }
    
    const data = await response.json().catch(() => ({}));
    const filename = data?.photo;
    return filename ? `${baseUrl}/api/logo/download/${filename}` : '/favicon.ico';
  } catch (error) {
    console.warn("Error fetching favicon, using default:", error.message);
    return '/favicon.ico';
  }
}

async function fetchMetaDataFromEndpoint(endpoint, slug, favicon) {
  try {
    const queryParam = slug ? `?slug=${encodeURIComponent(slug)}` : "?slug=";
    const url = `${baseUrl}${endpoint}${queryParam}`;
    
    const res = await fetchWithTimeout(url, { 
      next: { revalidate: 60 }, // Cache for 1 hour
      credentials: 'include'
    }, 5000); // 5 second timeout

    if (!res.ok) {
      console.warn(`[fetchMetaDataFromEndpoint] API error (${res.status}): ${url}`);
      return getDefaultMetadata(slug, favicon);
    }

    const json = await res.json().catch(() => ({}));

    if (!json?.success || !json.data) {
      console.warn(`[fetchMetaDataFromEndpoint] Invalid response format: ${url}`);
      return getDefaultMetadata(slug, favicon);
    }

    const meta = json.data;
    const title = meta.metaTitle || (slug ? `${slug.split('-').join(' ')} - Apurva Chemicals` : 'Apurva Chemicals');
    const description = meta.metaDescription || 'Leading manufacturer of specialty chemicals';
    
    return {
      title: title,
      description: description,
      keywords: meta.metaKeyword
        ? meta.metaKeyword.split(",").filter(Boolean).map(k => k.trim())
       : ["chemicals", "industrial"],
      openGraph: {
        title: title,
        description: description,
        url: `https://www.apurvachemicals.com/${slug || ""}`,
        siteName: "Apurva Chemicals",
        images: [
          {
            url: favicon || "/favicon.ico",
            width: 32,
            height: 32,
            alt: "Apurva Chemicals Logo",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      icons: { icon: favicon || "/favicon.ico" },
      alternates: {
        canonical: meta.metaCanonical || `https://www.apurvachemicals.com/${slug || ""}`,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    };
  } catch (error) {
    console.error(`[fetchMetaDataFromEndpoint] Error for ${endpoint}:`, error.message);
    return getDefaultMetadata(slug, favicon);
  }
}

function getDefaultMetadata(slug, favicon) {
  const title = slug 
    ? `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Apurva Chemicals`
    : 'Apurva Chemicals';
    
  return {
    title: title,
    description: 'Leading manufacturer of specialty chemicals',
    icons: { icon: favicon || "/favicon.ico" },
    alternates: { 
      canonical: `https://www.apurvachemicals.com/${slug || ""}` 
    },
    openGraph: {
      title: title,
      description: 'Leading manufacturer of specialty chemicals',
      url: `https://www.apurvachemicals.com/${slug || ""}`,
      siteName: "Apurva Chemicals",
      images: [
        {
          url: favicon || "/favicon.ico",
          width: 32,
          height: 32,
          alt: "Apurva Chemicals Logo",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: 'Leading manufacturer of specialty chemicals',
    },
  };
}

// ✅ Special function for Home Page
export async function getHomePageMetadata() {
  try {
    const favicon = await getFaviconPath();
    const url = `${baseUrl}/api/staticMeta?slug=/`; // exact format your backend expects
    // console.log("Fetching home page meta from:", url);

    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const meta = await response.json();
    
    return {
      title: meta.data?.metaTitle || "Apurva Chemicals",
      description: meta.data?.metaDescription || "Apurva Chemicals - Leading Chemical Solutions",
      keywords: meta.data?.metaKeyword
        ? meta.data.metaKeyword.split(",").map(k => k.trim())
        : ["chemicals", "industrial chemicals", "Apurva Chemicals"],
      icons: { icon: favicon || "/favicon.ico" },
      openGraph: {
        title: meta.data?.metaTitle || "Apurva Chemicals",
        description: meta.data?.metaDescription || "Apurva Chemicals - Leading Chemical Solutions",
        url: "https://www.apurvachemicals.com",
        siteName: "Apurva Chemicals",
        images: [
          {
            url: favicon || "/favicon.ico",
            width: 32,
            height: 32,
            alt: "Apurva Chemicals Logo",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      alternates: {
        canonical: meta.data?.metaCanonical || "https://www.apurvachemicals.com",
      },
      twitter: {
        card: "summary_large_image",
        title: meta.data?.metaTitle || "Apurva Chemicals",
        description: meta.data?.metaDescription || "Apurva Chemicals - Leading Chemical Solutions",
        images: [favicon || "/favicon.ico"],
      },
    };
  } catch (err) {
    console.error("[getHomePageMetadata] Unexpected error:", err);
    return {
      title: "Apurva Chemicals",
      description: "Apurva Chemicals - Leading Chemical Solutions",
      icons: { icon: "/favicon.ico" },
      alternates: { canonical: "https://www.apurvachemicals.com" },
    };
  }
}

export async function getMetadataBySlug(slug = "", isStatic = false) {
  try {
    // Get favicon in parallel with metadata fetch for better performance
    const [favicon, metadata] = await Promise.all([
      getFaviconPath(),
      (async () => {
        try {
          const endpoint = isStatic ? "/api/staticMeta" : "/api/meta";
          return await fetchMetaDataFromEndpoint(endpoint, slug, null);
        } catch (error) {
          console.warn(`[getMetadataBySlug] Error fetching metadata for ${slug}:`, error.message);
          return null;
        }
      })()
    ]);

    // If metadata fetch failed, return default with favicon
    if (!metadata) {
      return getDefaultMetadata(slug, favicon);
    }

    // Ensure favicon is set in the returned metadata
    return {
      ...metadata,
      icons: { icon: favicon || "/favicon.ico" },
    };
  } catch (error) {
    console.error("[getMetadataBySlug] Unexpected error:", error);
    return getDefaultMetadata(slug, "/favicon.ico");
  }
}


export async function getProductCategoryMetadata(slug = "") {
  try {
    const favicon = await getFaviconPath();

    const url = `${baseUrl}/api/product/getProductsByCategory?categorySlug=${slug}`;
    // console.log("Fetching product category meta from:", url);

    const res = await fetch(url, { next: { revalidate: 10 } });

    // console.log("response", res)

    if (!res.ok) {
      console.error(`[getProductCategoryMetadata] Error: ${res.status} ${res.statusText}`);
      return {
        title: "Error",
        description: `Failed to fetch metadata: ${res.statusText}`,
        icons: { icon: favicon || "/favicon.ico" },
        alternates: {
          canonical: `https://www.apurvachemicals.com/product-category/${slug || ""}`,
        },
      };
    }

    const json = await res.json();

    // console.log("json recieved", json.category)

    if (!json.category) {
      return {
        title: "Not Found",
        description: "Product category metadata not found.",
        icons: { icon: favicon || "/favicon.ico" },
        alternates: {
          canonical: `https://www.apurvachemicals.com/product-category/${slug || ""}`,
        },
      };
    }

    const meta = json.category;
    return {
      title: meta.metatitle || meta.name || "Product Category",
      description: meta.metadescription || "",
      keywords: meta.metakeywords
        ? meta.metakeywords.split(",").map(k => k.trim())
        : [],
      openGraph: {
        title: meta.metatitle || meta.name || "",
        description: meta.metadescription || "",
      },
      icons: { icon: favicon || "/favicon.ico" },
      alternates: {
        canonical:
          meta.metacanonical ||
          `https://www.apurvachemicals.com/product-category/${slug || ""}`,
      },
      ...meta
    };
  } catch (err) {
    console.error("[getProductCategoryMetadata] Unexpected erro r:", err);
    return {
      title: "Error",
      description: "An unexpected error occurred while loading product category metadata.",
      icons: { icon: "/favicon.ico" },
      alternates: {
        canonical: `https://www.apurvachemicals.com/product-category/${slug || ""}`,
      },
    };
  }
}
