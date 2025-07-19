module.exports = {
    siteUrl: 'http://localhost:3058',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' }
      ],
      additionalSitemaps: [
        'http://localhost:3058/sitemap1.xml',
        'http://localhost:3058/blogs.xml',
        'http://localhost:3058/chemical.xml'
      ]
    }
  };