// Fix fallback logic — make sure prod URL is actually reachable
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === "production"
      ? "https://www.apurvachemicals.com"
      : "http://localhost:3023");

async function getFaviconPath() {
  try {
    const response = await fetch(`https://status.rndtd.com/api/logo/getfavicon`, {
      next: { revalidate: 0 },
    });
    if (!response.ok) throw new Error("Failed to fetch favicon");
    const data = await response.json();
    // console.log("favicon data",data);
    const filename = data?.photo;
    // console.log("favicon", data)
    return filename ? `${baseUrl}/api/logo/download/${filename}` : null; 
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return null;
  }
}

async function fetchMetaDataFromEndpoint(endpoint, slug, favicon) {
  // Handle homepage (no slug) properly
  const queryParam = slug ? `?slug=${encodeURIComponent(slug)}` : "?slug=";
  const url = `${baseUrl}${endpoint}${queryParam}`;
  console.log("Fetching meta from:", url);

  const res = await fetch(url, { cache: "no-store" });

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
    console.log("Fetching home page meta from:", url);

    const meta = await fetch(url, { cache: "no-store" });
    return {
      title: meta.metaTitle || "Loading...",
      description: meta.metaDescription || "",
      keywords: meta.metaKeyword
        ? meta.metaKeyword.split(",").map(k => k.trim())
        : [],
      openGraph: {
        title: meta.metaTitle || "",
        description: meta.metaDescription || "",
      },
      alternates: {
        canonical: meta.metaCanonical || `https://www.apurvachemicals.com`,
      },
    };
  } catch (err) {
    console.error("[getHomePageMetadata] Unexpected error:", err);
    return {
      title: "Error",
      description: "An unexpected error occurred while loading home page metadata.",
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
