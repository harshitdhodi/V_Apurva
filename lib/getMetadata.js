// Fix fallback logic — make sure prod URL is actually reachable
const baseUrl = "https://www.apurvachemicals.com";

async function getFaviconPath() {
  try {
    const response = await fetch(`https://www.apurvachemicals.com/api/logo/getfavicon`, {
      next: { revalidate: 0 },
    });
    if (!response.ok) throw new Error("Failed to fetch favicon");
    const data = await response.json();
    // console.log("favicon data",data);
    const filename = data?.photo;
    // console.log("favicon", data)
    return filename ? `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/api/logo/download/${filename}` : null; 
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return null;
  }
}

async function fetchMetaDataFromEndpoint(endpoint, slug, favicon) {
  // Handle homepage (no slug) properly
  const queryParam = slug ? `?slug=${encodeURIComponent(slug)}` : "?slug=";
  const url = `${baseUrl}${endpoint}${queryParam}`;
  // console.log("Fetching meta from:", url);

  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    console.error(`[getMetadataBySlug] Error: ${res.status} ${res.statusText}`);
    return {
      title: "Error",
      description: `Failed to fetch metadata: ${res.statusText}`,
      icons: { icon: favicon || "/favicon.ico" },
      alternates: { canonical: `https://www.apurvachemicals.com/${slug || ""}` },
    };
  }

  const json = await res.json();

  if (!json.success || !json.data) {
    return {
      title: "Not Found",
      description: "Metadata not found.",
      icons: { icon: favicon || "/favicon.ico" },
      alternates: { canonical: `https://www.apurvachemicals.com/${slug || ""}` },
    };
  }

  const meta = json.data;
  return {
    title: meta.metaTitle || "Default Title",
    description: meta.metaDescription || "",
    keywords: meta.metaKeyword
      ? meta.metaKeyword.split(",").map(k => k.trim())
      : [],
    openGraph: {
      title: meta.metaTitle || "",
      description: meta.metaDescription || "",
    },
    icons: { icon: favicon || "/favicon.ico" },
    alternates: {
      canonical: meta.metaCanonical || `https://www.apurvachemicals.com/${slug || ""}`,
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
    const favicon = await getFaviconPath();

    // Use correct working endpoint for static pages
    const endpoint = isStatic
      ? "/api/staticMeta"  // ✅ Your backend accepts slug param directly here
      : "/api/meta";

    return await fetchMetaDataFromEndpoint(endpoint, slug, favicon);
  } catch (err) {
    console.error("[getMetadataBySlug] Unexpected error:", err);
    return {
      title: "Error",
      description: "An unexpected error occurred while loading metadata.",
      icons: { icon: "/favicon.ico" },
      alternates: { canonical: `https://www.apurvachemicals.com/${slug || ""}` },
    };
  }
}


export async function getProductCategoryMetadata(slug = "") {
  try {
    const favicon = await getFaviconPath();

    const url = `${baseUrl}/api/product/getProductsByCategory?categorySlug=${slug}`;
    // console.log("Fetching product category meta from:", url);

    const res = await fetch(url, { cache: "no-store" });

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
