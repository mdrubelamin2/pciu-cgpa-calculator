import { Redis } from '@upstash/redis'
import { parse, stringify } from 'jcof'
import { LRUCache } from 'lru-cache'
import { isObjectEmpty } from './helpers'

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

const compress = data => stringify(data)

const decompress = data => {
  if (!isObjectEmpty(data)) {
    return data
  }
  return parse(data)
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
    return decompress(this.cache.get(this._getKey(key)))
  }
  async set(key, value) {
    this.cache.set(this._getKey(key), compress(value))
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
    return await redis.exists(this._getKey(key))
  }
  async get(key) {
    const value = await redis.get(this._getKey(key))
    return decompress(value)
  }
  async set(key, value) {
    return await redis.set(this._getKey(key), compress(value), {
      ex: this.ttl,
    })
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
