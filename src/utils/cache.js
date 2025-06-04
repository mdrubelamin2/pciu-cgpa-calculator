import { LRUCache } from 'lru-cache'

const caches = {}

export function getCache(name, options = { max: 200 }) {
  if (!caches[name]) {
    caches[name] = new LRUCache(options)
  }
  return caches[name]
}

export function clearAllCaches() {
  Object.values(caches).forEach(cache => cache.clear())
}
