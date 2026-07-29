import { useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FilterState {
  categories: string[]
  minPrice: string
  maxPrice: string
  inStock: boolean
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters: () => void
  className?: string
}

const colorSwatches = [
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Cream', hex: '#FFF8F0' },
  { name: 'Sand', hex: '#C2B280' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Caramel', hex: '#FFD599' },
  { name: 'Mocha', hex: '#967969' },
  { name: 'Chocolate', hex: '#3E2723' },
  { name: 'Gold', hex: '#C9A94E' },
  { name: 'Blush', hex: '#DE6FA1' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Dusty Rose', hex: '#C9A0A0' },
  { name: 'Navy', hex: '#2C3E50' },
]

export function FilterSidebar({ filters, onFilterChange, onClearFilters, className }: FilterSidebarProps) {
  const { data: categories, isLoading } = useCategories()
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? []
      : [categoryId]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const toggleColor = (colorName: string) => {
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter((c) => c !== colorName)
      : [...selectedColors, colorName]
    setSelectedColors(newColors)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.inStock

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-chocolate flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs text-mocha hover:text-gold">
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-display text-sm font-semibold text-chocolate uppercase tracking-wider">Category</h4>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-beige animate-pulse" />
                <div className="h-4 w-20 rounded bg-beige animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories?.map((category) => (
              <label
                key={category._id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.categories.includes(category._id)}
                  onCheckedChange={() => toggleCategory(category._id)}
                />
                <span className="text-sm text-mocha group-hover:text-chocolate transition-colors">
                  {category.name}
                </span>
                {category.productCount !== undefined && (
                  <span className="ml-auto text-xs text-sand">({category.productCount})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="font-display text-sm font-semibold text-chocolate uppercase tracking-wider">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
            className="h-9 text-xs"
            min="0"
          />
          <span className="text-mocha">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="h-9 text-xs"
            min="0"
          />
        </div>
      </div>

      <Separator />

      {/* Color Filter */}
      <div className="space-y-3">
        <h4 className="font-display text-sm font-semibold text-chocolate uppercase tracking-wider">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colorSwatches.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
                selectedColors.includes(color.name)
                  ? 'border-gold ring-2 ring-gold/30 scale-110'
                  : 'border-white hover:border-sand'
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm font-semibold text-chocolate uppercase tracking-wider">In Stock Only</h4>
          <Switch
            checked={filters.inStock}
            onCheckedChange={(checked) => onFilterChange({ ...filters, inStock: checked })}
          />
        </div>
      </div>

      <Separator />

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full border-gold/30 text-chocolate hover:bg-gold hover:text-white"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
