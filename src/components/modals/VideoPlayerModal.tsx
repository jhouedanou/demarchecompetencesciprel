'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { X, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react'
import 'swiper/css'

interface Video {
  id: number
  title: string
  description: string
  url: string
}

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videos: Video[]
  initialVideoIndex?: number
}

export function VideoPlayerModal({ isOpen, onClose, videos, initialVideoIndex = 0 }: VideoPlayerModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialVideoIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    if (isOpen && swiperRef.current) {
      swiperRef.current.slideTo(initialVideoIndex)
    }
  }, [isOpen, initialVideoIndex])

  const handlePrevious = () => {
    if (swiperRef.current && activeIndex > 0) {
      swiperRef.current.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current && activeIndex < videos.length - 1) {
      swiperRef.current.slideNext()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full h-[95vh] sm:h-[90vh] p-0 bg-black overflow-hidden border-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors shadow-lg"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <Swiper
          direction="vertical"
          slidesPerView={1}
          speed={500}
          mousewheel={true}
          keyboard={true}
          modules={[Mousewheel, Keyboard]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full w-full"
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video.id}>
              <div className="relative h-full w-full flex flex-col bg-gradient-to-br from-gray-900 to-black">
                {/* Video Container */}
                <div className="flex-1 relative flex items-center justify-center p-4">
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      src={`${video.url}?autoplay=0&rel=0&modestbranding=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pb-24">
                  <div className="flex items-start gap-3">
                    <div className="bg-ciprel-orange-500 rounded-full p-2 flex-shrink-0">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {video.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
                  {videos.map((video, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                    >
                      <div
                        className={`w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === index
                            ? 'bg-ciprel-orange-500 h-12'
                            : idx < index
                            ? 'bg-white/60 h-8'
                            : 'bg-white/20 h-6'
                        }`}
                        onClick={() => swiperRef.current?.slideTo(idx)}
                      />
                      {/* Tooltip */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                        <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{video.title}</div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 flex flex-col gap-3">
          <button
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            className={`bg-white/90 hover:bg-white rounded-full p-3 transition-all shadow-lg ${
              activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'
            }`}
            aria-label="Vidéo précédente"
          >
            <ChevronUp className="h-6 w-6 text-black" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === videos.length - 1}
            className={`bg-white/90 hover:bg-white rounded-full p-3 transition-all shadow-lg ${
              activeIndex === videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'
            }`}
            aria-label="Vidéo suivante"
          >
            <ChevronDown className="h-6 w-6 text-black" />
          </button>
        </div>

        {/* Counter */}
        <div className="absolute top-4 left-4 z-40 bg-ciprel-orange-500/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <span className="text-white text-sm font-bold">
            {activeIndex + 1} / {videos.length}
          </span>
        </div>

        {/* Hint Text */}
        {videos.length > 1 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 animate-bounce">
              <p className="text-white text-xs font-medium">
                Swipe pour changer de vidéo
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
