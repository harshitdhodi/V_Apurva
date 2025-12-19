"use client"

import { useEffect } from 'react';

// This component handles only client-side features that don't affect SEO
function ClientContactImg() {
    useEffect(() => {
        // Scroll to top on page load
        window.scrollTo(0, 0);
    }, []);

    // This component renders nothing visible - it just handles client-side effects
    return null;
}

export default ClientContactImg;