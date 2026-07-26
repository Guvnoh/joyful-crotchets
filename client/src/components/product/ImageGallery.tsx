import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn, getImageUrl } from '@/lib/utils'
import type { ProductImage } from '@/types'

interface ImageGalleryProps {
  images: ProductImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const mainImageRef = useRef<HTMLDivElement>(null)

  const selectedImage = images[selectedIndex]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-cream via-linen to-beige flex items-center justify-center">
        <span className="text-mocha/30 font-display text-xl">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-cream cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={getImageUrl(selectedImage.url)}
            alt={selectedImage.alt}
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={
              isZoomed
                ? {
                    transform: 'scale(2)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
          {selectedImage.alt?.toLowerCase().includes('new') && (
            <span className="inline-flex items-center rounded-full bg-chocolate px-3 py-1 text-xs font-semibold text-white shadow-lg">
              New
            </span>
          )}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs text-chocolate shadow-lg">
            <ZoomIn className="h-3.5 w-3.5" />
            Hover to zoom
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-chocolate hover:bg-white hover:text-gold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-chocolate hover:bg-white hover:text-gold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Click to open lightbox */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 z-0"
          aria-label="Open image in lightbox"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-gold ring-2 ring-gold/20'
                  : 'border-transparent hover:border-sand/50 opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={getImageUrl(image.url)}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-none p-0 gap-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative flex items-center justify-center min-h-[50vh] max-h-[80vh]">
              <img
                src={getImageUrl(selectedImage.url)}
                alt={selectedImage.alt}
                className="max-h-[80vh] max-w-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Lightbox thumbnails */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 p-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      'h-16 w-16 overflow-hidden rounded-md border-2 transition-all',
                      selectedIndex === index
                        ? 'border-gold'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    )}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
