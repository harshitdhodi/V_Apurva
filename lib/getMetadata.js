const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function getFaviconPath() {
  try {
    const response = await fetch(`https://status.rndtd.com/api/logo/getfavicon`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch favicon");
    const data = await response.json();
    console.log("favicon data",data);
    const filename = data?.photo;
    console.log("favicon", data)
    return filename ? `${baseUrl}/api/logo/download/${filename}` : null; 
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return null;
  }
}

export async function getMetadataBySlug(slug) {
  try {
    const [favicon, res] = await Promise.all([
      getFaviconPath(),
      fetch(`${baseUrl}/api/meta?slug=${slug}`, {
        cache: 'no-store',
      }),
    ]);

    if (!res.ok) {
      console.error(`[getMetadataBySlug] Error: ${res.status} ${res.statusText}`);
      return {
        title: 'Error',
        description: `Failed to fetch metadata: ${res.statusText}`,
        icons: {
          icon: favicon || '/favicon.ico',
        },
      };
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      return {
        title: 'Not Found',
        description: 'Metadata not found.',
        icons: {
          icon: favicon || '/favicon.ico',
        },
      };
    }

    const meta = json.data;

    return {
      title: meta.metaTitle || 'Default Title',
      description: meta.metaDescription || '',
      keywords: meta.metaKeyword
        ? meta.metaKeyword.split(',').map(k => k.trim())
        : [],
      openGraph: {
        title: meta.metaTitle || '',
        description: meta.metaDescription || '',
      },
      icons: {
        icon: favicon || '/favicon.ico',
      },
    };
  } catch (err) {
    console.error('[getMetadataBySlug] Unexpected error:', err);
    return {
      title: 'Error',
      description: 'An unexpected error occurred while loading metadata.',
      icons: {
        icon: '/favicon.ico',
      },
    };
  }
}
