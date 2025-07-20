module.exports = {
    siteUrl: 'http://localhost:3023',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }
      ],
      additionalSitemaps: [
        'http://localhost:3023/sitemap1.xml',
        'http://localhost:3023/blogs.xml',
        'http://localhost:3023/chemical.xml'
      ]
    }
  };