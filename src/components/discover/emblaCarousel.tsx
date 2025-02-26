"use client";
import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlideType } from "@/types/slideTypes";
import Image from "next/image"
type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
  onCardClick: (slide: SlideType) => void;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options, onCardClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      const autoplay = emblaApi.plugins().autoplay;
      if (autoplay && autoplay.options.stopOnInteraction === false) {
        autoplay.reset();
      }
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      const autoplay = emblaApi.plugins().autoplay;
      if (autoplay && autoplay.options.stopOnInteraction === false) {
        autoplay.reset();
      }
    }
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      const autoplay = emblaApi.plugins().autoplay;
      if (autoplay && autoplay.options.stopOnInteraction === false) {
        autoplay.reset();
      }
    },
    [emblaApi]
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl max-w-7xl h-[80vh] md:h-[80vh] lg:h-[80vh] xl:h-[80vh]">
      {/* Main carousel viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-none w-full h-full transition-transform duration-300 ease-in-out cursor-pointer"
              onClick={() => onCardClick(slide)}
            >
              <div className="relative h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 w-full">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 line-clamp-2">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-gray-100 max-w-3xl line-clamp-3 mb-4">
                    {slide.description}
                  </p>
                  <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors">
                    View Details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        onClick={scrollNext}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? "bg-white w-8" 
                : "bg-white/40 w-2.5 hover:bg-white/60"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaCarousel;