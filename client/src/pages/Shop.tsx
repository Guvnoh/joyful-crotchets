import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, SlidersHorizontal, X, LayoutGrid, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductCard } from '@/components/common/ProductCard'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { SortSelect, type SortOption } from '@/components/shop/SortSelect'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface FilterState {
  categories: string[]
  minPrice: string
  maxPrice: string
  inStock: boolean
}

const ITEMS_PER_PAGE = 12

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewColumns, setViewColumns] = useState<2 | 3 | 4>(3)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { data: categories = [] } = useCategories()

  const categorySlug = searchParams.get('category')

  const resolvedCategoryId = useMemo(() => {
    if (!categorySlug) return null
    const match = categories.find((c) => c.slug === categorySlug || c._id === categorySlug)
    return match?._id || null
  }, [categorySlug, categories])

  // Read filters from URL
  const [filters, setFilters] = useState<FilterState>({
    categories: resolvedCategoryId ? [resolvedCategoryId] : [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
  })

  // Sync filters when resolved category changes
  useEffect(() => {
    if (resolvedCategoryId && !filters.categories.includes(resolvedCategoryId)) {
      setFilters((prev) => ({ ...prev, categories: [resolvedCategoryId] }))
    } else if (!categorySlug && filters.categories.length > 0) {
      setFilters((prev) => ({ ...prev, categories: [] }))
    }
  }, [resolvedCategoryId, categorySlug])

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const searchQuery = searchParams.get('search') || ''
  const sortValue = (searchParams.get('sort') || 'newest') as SortOption

  // Sync URL params
  const updateSearchParams = useCallback(
    (newFilters: FilterState, page: number, sort: SortOption) => {
      const params = new URLSearchParams()
      if (newFilters.categories.length > 0) params.set('category', newFilters.categories[0])
      if (searchQuery) params.set('search', searchQuery)
      if (sort !== 'newest') params.set('sort', sort)
      if (page > 1) params.set('page', String(page))
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice)
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice)
      if (newFilters.inStock) params.set('inStock', 'true')
      setSearchParams(params, { replace: true })
    },
    [searchQuery, setSearchParams]
  )

  // Build API filters
  const apiFilters = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    category: filters.categories.length > 0 ? filters.categories[0] : undefined,
    search: searchQuery || undefined,
    sort: sortValue === 'newest' ? '-createdAt' : sortValue === 'price_asc' ? 'price' : sortValue === 'price_desc' ? '-price' : sortValue === 'name_asc' ? 'name' : '-sold',
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    inStock: filters.inStock || undefined,
  }

  const { data, isLoading, isFetching } = useProducts(apiFilters)
  const products = data?.data || []
  const pagination = data?.pagination
  const totalPages = pagination?.pages || 1

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateSearchParams(newFilters, 1, sortValue)
  }

  const handleSortChange = (sort: SortOption) => {
    updateSearchParams(filters, currentPage, sort)
  }

  const handlePageChange = (page: number) => {
    updateSearchParams(filters, page, sortValue)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAllFilters = () => {
    const cleared: FilterState = { categories: [], minPrice: '', maxPrice: '', inStock: false }
    setFilters(cleared)
    updateSearchParams(cleared, 1, sortValue)
  }

  const hasActiveFilters = filters.categories.length > 0 || filters.minPrice || filters.maxPrice || filters.inStock

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-chocolate via-mocha to-chocolate py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <nav className="flex items-center justify-center gap-2 text-sm text-cream/70 mb-4">
              <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-cream/40">/</span>
              <span className="text-gold">Shop</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream">Our Collection</h1>
            <p className="text-cream/70 mt-3 max-w-xl mx-auto">
              Discover our handcrafted crochet pieces, each made with love and attention to detail
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 premium-shadow">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Trigger */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-sand/50">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                          {filters.categories.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.inStock ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-white">
                    <div className="pt-8">
                      <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearAllFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-mocha">
                  {isLoading ? (
                    <span className="inline-block h-4 w-32 bg-beige animate-pulse rounded" />
                  ) : (
                    <>Showing <span className="font-semibold text-chocolate">{products.length}</span> of {pagination?.total || 0} products</>
                  )}
                </p>

                {isFetching && !isLoading && (
                  <div className="h-4 w-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <SortSelect value={sortValue} onChange={handleSortChange} />

                {/* Grid View Toggle */}
                <div className="hidden sm:flex items-center border border-sand/50 rounded-lg p-1">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => setViewColumns(cols as 2 | 3 | 4)}
                      className={cn(
                        'p-1.5 rounded transition-colors',
                        viewColumns === cols ? 'bg-gold text-white' : 'text-mocha hover:text-chocolate'
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" style={{ width: `${cols * 5}px` }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-mocha">Active filters:</span>
                {filters.categories.map((catId) => {
                  const cat = categories.find((c) => c._id === catId)
                  return (
                    <span key={catId} className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs text-gold font-medium">
                      {cat?.name || 'Category'}
                      <button onClick={() => handleFilterChange({ ...filters, categories: [] })}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
                {filters.minPrice && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs text-gold font-medium">
                    Min: ₦{filters.minPrice}
                    <button onClick={() => handleFilterChange({ ...filters, minPrice: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs text-gold font-medium">
                    Max: ₦{filters.maxPrice}
                    <button onClick={() => handleFilterChange({ ...filters, maxPrice: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs text-gold font-medium">
                    In Stock
                    <button onClick={() => handleFilterChange({ ...filters, inStock: false })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-mocha hover:text-gold underline transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading ? (
              <div className={cn(
                'grid gap-6',
                viewColumns === 2 && 'grid-cols-1 sm:grid-cols-2',
                viewColumns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                viewColumns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
              )}>
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-beige/50 flex items-center justify-center mx-auto mb-6">
                  <PackageOpen className="h-12 w-12 text-mocha/40" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-chocolate mb-2">No products found</h3>
                <p className="text-mocha mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your search or browse our full collection.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={clearAllFilters}
                    className="bg-gold text-white hover:bg-gold/90"
                  >
                    Clear Filters
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Product Grid */
              <div className={cn(
                'grid gap-6',
                viewColumns === 2 && 'grid-cols-1 sm:grid-cols-2',
                viewColumns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                viewColumns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
              )}>
                <AnimatePresence mode="wait">
                  {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-sand/50 text-chocolate hover:bg-gold hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <Button
                      key={index}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        'min-w-[36px]',
                        currentPage === page
                          ? 'bg-gold text-white hover:bg-gold/90'
                          : 'border-sand/50 text-chocolate hover:bg-gold hover:text-white'
                      )}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={index} className="px-2 text-mocha">...</span>
                  )
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-sand/50 text-chocolate hover:bg-gold hover:text-white disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
