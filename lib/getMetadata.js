const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getMetadataBySlug(slug) {
  try {
    const res = await fetch(`${baseUrl}/api/meta?slug=${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[getMetadataBySlug] Error: ${res.status} ${res.statusText}`);
      return {
        title: 'Error',
        description: `Failed to fetch metadata: ${res.statusText}`,
      };
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      return {
        title: 'Not Found',
        description: 'Metadata not found.',
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
    };
  } catch (err) {
    console.error('[getMetadataBySlug] Unexpected error:', err);
    return {
      title: 'Error',
      description: 'An unexpected error occurred while loading metadata.',
    };
  }
}