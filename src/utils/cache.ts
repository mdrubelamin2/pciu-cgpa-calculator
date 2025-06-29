import { Redis } from '@upstash/redis'
import { parse, stringify } from 'jcof'
import { LRUCache } from 'lru-cache'
import { isJCOFString } from './helpers'
import { CacheOptions } from '../../types'

let useMemoryCache = false
let redis: Redis | undefined
try {
  redis = Redis.fromEnv()
} catch {
  useMemoryCache = true
}

const defaultCacheOptions: CacheOptions = {
  ttl: 120 * 24 * 60 * 60,
  max: 1000,
}

const compress = (data: any): string => stringify(data)

const decompress = (data: string): any =>
  isJCOFString(data) ? parse(data) : data

class MemoryCache {
  private name: string
  private cache: LRUCache<string, string>

  constructor(name: string, { ttl, max }: CacheOptions = defaultCacheOptions) {
    this.name = name
    this.cache = new LRUCache({ max, ttl: ttl * 1000 })
  }
  async has(key: string): Promise<boolean> {
    return this.cache.has(this._getKey(key))
  }
  async get(key: string): Promise<any> {
    return decompress(this.cache.get(this._getKey(key)) || '')
  }
  async set(key: string, value: any): Promise<void> {
    this.cache.set(this._getKey(key), compress(value))
  }
  _getKey(key: string): string {
    return `${this.name}:${key}`
  }
}

class RedisCache {
  private name: string
  private ttl: number

  constructor(
    name: string,
    { ttl }: Pick<CacheOptions, 'ttl'> = defaultCacheOptions
  ) {
    this.name = name
    this.ttl = ttl
  }
  async has(key: string): Promise<boolean> {
    if (!redis) return false
    return (await redis.exists(this._getKey(key))) > 0
  }
  async get(key: string): Promise<any> {
    if (!redis) return null
    const value = await redis.get(this._getKey(key))
    return value ? decompress(value as string) : null
  }
  async set(key: string, value: any): Promise<void> {
    if (!redis) return
    await redis.set(this._getKey(key), compress(value), {
      ex: this.ttl,
    })
  }
  _getKey(key: string): string {
    return `${this.name}:${key}`
  }
}

const serverCaches: Record<string, RedisCache> = {}
const memoryCaches: Record<string, MemoryCache> = {}

export function getCache(
  name: string,
  options: CacheOptions = defaultCacheOptions
): MemoryCache | RedisCache {
  if (useMemoryCache) {
    if (!memoryCaches[name]) memoryCaches[name] = new MemoryCache(name, options)
    return memoryCaches[name]
  }
  if (!serverCaches[name]) serverCaches[name] = new RedisCache(name, options)
  return serverCaches[name]
}
