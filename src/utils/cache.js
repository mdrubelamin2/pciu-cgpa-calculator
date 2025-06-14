import { Redis } from '@upstash/redis'
import { LRUCache } from 'lru-cache'

let useMemoryCache = false
let redis
try {
  redis = Redis.fromEnv()
} catch {
  useMemoryCache = true
}

const defaultCacheOptions = {
  ttl: 120 * 24 * 60 * 60,
  max: 1000,
}

class MemoryCache {
  constructor(name, { ttl, max } = defaultCacheOptions) {
    this.name = name
    this.cache = new LRUCache({ max, ttl: ttl * 1000 })
  }
  async has(key) {
    return this.cache.has(this._getKey(key))
  }
  async get(key) {
    return this.cache.get(this._getKey(key)) ?? null
  }
  async set(key, value) {
    this.cache.set(this._getKey(key), value)
    return true
  }
  _getKey(key) {
    return `${this.name}:${key}`
  }
}

class RedisCache {
  constructor(name, { ttl } = defaultCacheOptions) {
    this.name = name
    this.ttl = ttl
  }
  async has(key) {
    return (await redis.get(this._getKey(key))) !== null
  }
  async get(key) {
    return await redis.get(this._getKey(key))
  }
  async set(key, value) {
    return await redis.set(this._getKey(key), value, { ex: this.ttl })
  }
  _getKey(key) {
    return `${this.name}:${key}`
  }
}

const serverCaches = {}
const memoryCaches = {}

export function getCache(name, options = defaultCacheOptions) {
  if (useMemoryCache) {
    if (!memoryCaches[name]) memoryCaches[name] = new MemoryCache(name, options)
    return memoryCaches[name]
  }
  if (!serverCaches[name]) serverCaches[name] = new RedisCache(name, options)
  return serverCaches[name]
}
