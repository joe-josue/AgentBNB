import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: 'https://yourproperty.com',
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://yourproperty.com/pricechecker',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://yourproperty.com/reserve',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://yourproperty.com/faq',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
