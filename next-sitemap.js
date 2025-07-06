module.exports = {
    siteUrl: 'http://localhost:3000',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }
      ],
      additionalSitemaps: [
        'http://localhost:3000/sitemap1.xml',
        'http://localhost:3000/blogs.xml',
        'http://localhost:3000/chemical.xml'
      ]
    }
  };