"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AnimatedImage } from "@/components/ui/animated-image"
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Download,
  Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Image {
  id: string
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: Image[]
  className?: string
  showThumbnails?: boolean
  autoplay?: boolean
  interval?: number
}

export function ImageGallery({ 
  images, 
  className, 
  showThumbnails = true,
  autoplay = false,
  interval = 3000
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!autoplay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const currentImage = images[currentIndex]

  if (images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-96 bg-gray-100 rounded-lg", className)}>
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Display */}
      <div className="relative group">
        <div 
          className={cn(
            "relative overflow-hidden rounded-lg shadow-lg",
            isFullscreen && "fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          )}
          onClick={toggleFullscreen}
        >
          <AnimatedImage
            src={currentImage.src}
            alt={currentImage.alt}
            width={isFullscreen ? 1200 : 800}
            height={isFullscreen ? 800 : 600}
            animation="fade"
            duration={500}
            className={cn(
              "cursor-pointer",
              isFullscreen && "max-w-7xl max-h-5xl"
            )}
          />
          
          {/* Image Controls */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className="bg-white/80 hover:bg-white"
            >
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="pointer-events-auto bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="pointer-events-auto bg-white/80 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && !isFullscreen && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-200",
                index === currentIndex 
                  ? "ring-2 ring-blue-500 scale-105" 
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              )}
              onClick={() => goToImage(index)}
            >
              <div className="relative w-20 h-20 overflow-hidden rounded">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Image {currentIndex + 1} of {images.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Download functionality would go here
              const link = document.createElement('a')
              link.href = currentImage.src
              link.download = `image-${currentImage.id}.jpg`
              link.click()
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
