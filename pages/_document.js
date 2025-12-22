import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* This script will remove bis_skin_checked attributes before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove any existing bis_skin_checked attributes
                document.querySelectorAll('[bis_skin_checked]').forEach(el => {
                  el.removeAttribute('bis_skin_checked');
                });

                // Set up a mutation observer to catch any attributes added later
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    } 
                  });
                });
                
                // Start observing the document with the configured parameters
                observer.observe(document.documentElement, { 
                  attributes: true, 
                  attributeFilter: ['bis_skin_checked'],
                  subtree: true,
                  childList: true
                });
              })();
            `,
          }}
        />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
