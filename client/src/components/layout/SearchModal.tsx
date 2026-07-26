import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  slug: string
}

export function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    searchProducts(debouncedQuery)
  }, [debouncedQuery, searchProducts])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSearchOpen, setSearchOpen])

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSearchOpen])

  const handleResultClick = (product: Product) => {
    setSearchOpen(false)
    navigate(`/shop?search=${encodeURIComponent(product.name)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      navigate(`/shop?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-chocolate-900/80 backdrop-blur-md"
                onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-chocolate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                autoFocus
                className="w-full pl-16 pr-14 py-6 text-xl bg-white rounded-2xl shadow-2xl border-0 outline-none text-chocolate-800 placeholder-chocolate-400"
              />
              <button
                type="button"
          onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-chocolate-400 hover:text-chocolate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </form>

            {/* Search Results */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-chocolate-100">
                    <p className="text-sm text-chocolate-500">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <div className="divide-y divide-chocolate-100">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-amber-50 transition-colors text-left"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-chocolate-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-chocolate-500">{product.category}</p>
                        </div>
                        <p className="font-semibold text-amber-700">
                          {formatPrice(product.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                  <p className="text-chocolate-500 mb-4">
                    No products found for "{query}"
                  </p>
                  <p className="text-sm text-chocolate-400">
                    Try different keywords or browse our categories
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
