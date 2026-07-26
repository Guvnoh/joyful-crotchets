import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const categories = ['All', 'Bags', 'Hats', 'Flowers', 'Home', 'Baby']

const galleryItems = [
  { id: 1, name: 'Boho Market Bag', category: 'Bags', gradient: 'from-caramel/40 to-sand/60' },
  { id: 2, name: 'Sunset Beanie', category: 'Hats', gradient: 'from-gold/40 to-caramel/60' },
  { id: 3, name: 'Rose Bouquet', category: 'Flowers', gradient: 'from-mocha/30 to-sand/50' },
  { id: 4, name: 'Cozy Blanket', category: 'Home', gradient: 'from-beige to-cream' },
  { id: 5, name: 'Baby Booties', category: 'Baby', gradient: 'from-caramel/30 to-ivory' },
  { id: 6, name: 'Tote Bag', category: 'Bags', gradient: 'from-sand/50 to-beige' },
  { id: 7, name: 'Winter Hat', category: 'Hats', gradient: 'from-mocha/40 to-caramel/40' },
  { id: 8, name: 'Lavender Bundle', category: 'Flowers', gradient: 'from-gold/30 to-sand/40' },
  { id: 9, name: 'Throw Pillow', category: 'Home', gradient: 'from-cream to-linen' },
  { id: 10, name: 'Baby Blanket', category: 'Baby', gradient: 'from-caramel/20 to-ivory' },
  { id: 11, name: 'Crossbody Bag', category: 'Bags', gradient: 'from-mocha/30 to-beige' },
  { id: 12, name: 'Beret', category: 'Hats', gradient: 'from-gold/40 to-caramel/30' },
  { id: 13, name: 'Sunflower', category: 'Flowers', gradient: 'from-gold/50 to-sand/40' },
  { id: 14, name: 'Wall Hanging', category: 'Home', gradient: 'from-sand/40 to-linen' },
  { id: 15, name: 'Hat & Scarf Set', category: 'Baby', gradient: 'from-caramel/30 to-cream' },
  { id: 16, name: 'Clutch Purse', category: 'Bags', gradient: 'from-mocha/40 to-sand/30' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null)

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-chocolate via-mocha to-chocolate">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">Our Work</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-4">Our Gallery</h1>
            <p className="text-cream/70 mt-4 max-w-xl mx-auto">
              Browse through our collection of handcrafted crochet creations
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  activeCategory === category
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-white text-chocolate border border-sand/30 hover:border-gold hover:text-gold'
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            layout
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="group relative w-full overflow-hidden rounded-2xl cursor-pointer"
                  >
                    <div
                      className={cn(
                        'w-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-110',
                        item.gradient,
                        index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                      )}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/50 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <ZoomIn className="h-8 w-8 text-white mx-auto mb-2" />
                        <p className="text-white font-display text-lg font-semibold">{item.name}</p>
                        <p className="text-white/70 text-sm">{item.category}</p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl bg-black/95 border-none p-0">
          {selectedImage && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className={cn('w-full aspect-[4/3] bg-gradient-to-br', selectedImage.gradient)} />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-display text-2xl font-semibold text-white">{selectedImage.name}</h3>
                <p className="text-white/70">{selectedImage.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
