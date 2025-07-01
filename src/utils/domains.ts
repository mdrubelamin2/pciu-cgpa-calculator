/**
 * Domain configuration for the application
 * Using constants makes it easier to update domains across the application
 */

// Primary domain is the preferred one for SEO
export const PRIMARY_DOMAIN =
  process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || 'https://pciu-result.vercel.app'

// Secondary domain is maintained for backward compatibility
export const SECONDARY_DOMAIN =
  process.env.NEXT_PUBLIC_SECONDARY_DOMAIN ||
  'https://pciu-cgpa-calculator.vercel.app'

// Get the current domain based on the request or default to primary
export function getCurrentDomain(req?: {
  headers?: { host?: string }
}): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // For server-side rendering
  if (req?.headers?.host) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return `${protocol}://${req.headers.host}`
  }

  return PRIMARY_DOMAIN
}

// Check if the current domain is the primary domain
export function isPrimaryDomain(domain: string): boolean {
  return domain === PRIMARY_DOMAIN
}
