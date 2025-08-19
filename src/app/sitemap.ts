import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/volunteer`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mission`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Try to fetch dynamic events, but fallback gracefully if database is not available
  let eventPages: MetadataRoute.Sitemap = []
  
  try {
    // Check if we're in a build environment where database might not be available
    if (process.env.POSTGRES_PRISMA_URL || process.env.NODE_ENV === 'development') {
      const events = await prisma.event.findMany({
        select: {
          id: true,
          updatedAt: true,
        },
      })
      
      eventPages = events.map((event: { id: string; updatedAt: Date }) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: event.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    // Log error but don't fail the build
    console.warn('Could not fetch events for sitemap:', error)
    // Fallback to empty array
    eventPages = []
  }

  return [...staticPages, ...eventPages]
}
