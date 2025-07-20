module.exports = {
    siteUrl: 'https://www.apurvachemicals.com',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }
      ],
      additionalSitemaps: [
        'https://www.apurvachemicals.com/sitemap1.xml',
        'https://www.apurvachemicals.com/blogs.xml',
        'https://www.apurvachemicals.com/chemical.xml'
      ]
    }
  };