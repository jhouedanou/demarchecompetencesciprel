/**
 * Simple in-memory cache with TTL (Time To Live) support
 * Optimized for serverless environments
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private readonly maxSize: number = 100 // Maximum number of entries

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Delete all cache entries that match a pattern
   * @param pattern - Pattern to match (supports * wildcard)
   */
  invalidatePattern(pattern: string): number {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    let count = 0

    const keysToDelete: string[] = []
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.cache.delete(key)
      count++
    })

    return count
  }

  /**
   * Evict the oldest entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; keys: string[] } {
    const keys: string[] = []
    this.cache.forEach((_, key) => keys.push(key))
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys,
    }
  }
}

// Singleton instance
export const cache = new MemoryCache()

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const

// Helper function for caching API responses
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    console.log(`📦 [Cache HIT] ${key}`)
    return cached
  }

  console.log(`🔄 [Cache MISS] ${key} - fetching fresh data`)
  
  // Fetch fresh data
  const data = await fetchFn()
  
  // Store in cache
  cache.set(key, data, ttl)
  
  return data
}

// Cache key generators
export const cacheKeys = {
  workshops: () => 'workshops:all',
  workshopById: (id: string) => `workshop:${id}`,
  questions: (type?: string, metierId?: string, workshopId?: string) => 
    `questions:${type || 'all'}:${metierId || 'none'}:${workshopId || 'none'}`,
  metiers: () => 'metiers:all',
  metierById: (id: number) => `metier:${id}`,
} as const
