"use client";

import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./emblaCarouselDotButtons";
import { PrevButton, NextButton, usePrevNextButtons } from "./emblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";


type SlideType = {
  id: string; 
  image: string;
  title: string;
  description: string;
  details: string;
  date: string;
  time: string;
  location: string;
  host: string;
  availableSlots: number;
  totalSlots: number;
  isCreator: boolean;
};

type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
  onCardClick: (slide: SlideType) => void;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options, onCardClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop = autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;
    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide cursor-pointer"
              onClick={() => onCardClick(slide)}
            >
              <div className="embla__slide">
                <img src={slide.image} alt={slide.title} className="embla__slide__image" />
              <div className="embla__slide__content">
                <h2 className="embla__slide__title">{slide.title}</h2>
                <p className="embla__slide__description">{slide.description}</p>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${index === selectedIndex ? "embla__dot--selected" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
