module.exports = {
<<<<<<< HEAD
    siteUrl: 'http://localhost:3000',
=======
    siteUrl: 'https://www.apurvachemicals.com',
>>>>>>> prod
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }
      ],
      additionalSitemaps: [
<<<<<<< HEAD
        'http://localhost:3000/sitemap1.xml',
        'http://localhost:3000/blogs.xml',
        'http://localhost:3000/chemical.xml'
=======
        'https://www.apurvachemicals.com/sitemap1.xml',
        'https://www.apurvachemicals.com/blogs.xml',
        'https://www.apurvachemicals.com/chemical.xml'
>>>>>>> prod
      ]
    }
  };