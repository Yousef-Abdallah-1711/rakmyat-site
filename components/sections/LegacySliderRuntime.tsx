"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type SliderInstance = {
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  autoplay?: { stop: () => void };
};
type SliderConstructor = new (
  element: HTMLElement,
  options: Record<string, unknown>,
) => SliderInstance;
declare global {
  interface Window {
    Swiper?: SliderConstructor;
  }
  interface HTMLElement {
    swiper?: SliderInstance;
  }
}

type SliderDefinition = { selector: string; options: Record<string, unknown> };
const sliders: SliderDefinition[] = [
  {
    selector: ".clients-slider5 .swiper-container",
    options: {
      spaceBetween: 0,
      centeredSlides: true,
      slidesPerView: 6,
      speed: 6000,
      autoplay: { delay: 1 },
      loop: true,
      allowTouchMove: false,
      breakpoints: {
        0: { slidesPerView: 2 },
        480: { slidesPerView: 2 },
        787: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1200: { slidesPerView: 6 },
      },
    },
  },
  {
    selector: ".testimonial-slider.style-5 .swiper-container",
    options: {
      slidesPerView: 4,
      spaceBetween: 0,
      speed: 1000,
      pagination: {
        el: ".testimonial-slider.style-5 .swiper-pagination",
        clickable: true,
      },
      navigation: false,
      mousewheel: false,
      keyboard: true,
      autoplay: { delay: 4000 },
      loop: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 1 },
        787: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    },
  },
  {
    selector: ".services-slider.style-6 .swiper-container",
    options: {
      slidesPerView: 6,
      centeredSlides: true,
      spaceBetween: 0,
      speed: 1000,
      pagination: false,
      navigation: false,
      mousewheel: false,
      keyboard: true,
      autoplay: { delay: 4000 },
      loop: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 1 },
        787: { slidesPerView: 2 },
        991: { slidesPerView: 4 },
        1200: { slidesPerView: 6 },
      },
    },
  },
  {
    selector: ".slider-3items .swiper-container",
    options: {
      slidesPerView: 3,
      spaceBetween: 0,
      speed: 1000,
      pagination: { el: ".slider-3items .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".slider-3items .swiper-button-next",
        prevEl: ".slider-3items .swiper-button-prev",
      },
      mousewheel: false,
      keyboard: true,
      autoplay: { delay: 4000 },
      loop: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 1 },
        787: { slidesPerView: 2 },
        991: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    },
  },
  {
    selector: ".culture-slider .swiper-container",
    options: {
      slidesPerView: 4,
      spaceBetween: 30,
      centeredSlides: true,
      speed: 1000,
      pagination: { el: ".culture-slider .swiper-pagination", clickable: true },
      navigation: false,
      mousewheel: false,
      keyboard: true,
      autoplay: { delay: 4000 },
      loop: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 1 },
        787: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    },
  },
  {
    selector: ".screenshots-slider.style-4 .swiper-container",
    options: {
      slidesPerView: 5,
      spaceBetween: 0,
      centeredSlides: true,
      speed: 1000,
      pagination: false,
      navigation: false,
      mousewheel: false,
      keyboard: true,
      autoplay: { delay: 4000 },
      loop: true,
      breakpoints: {
        0: { slidesPerView: 2 },
        480: { slidesPerView: 2 },
        787: { slidesPerView: 3 },
        991: { slidesPerView: 3 },
        1200: { slidesPerView: 5 },
      },
    },
  },
];

export function LegacySliderRuntime() {
  const pathname = usePathname();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const instances = useRef<SliderInstance[]>([]);
  const initialize = useCallback(() => {
    instances.current.forEach((instance) => instance.destroy(true, true));
    instances.current = [];
    const Swiper = window.Swiper;
    if (!Swiper) return;
    for (const definition of sliders) {
      document
        .querySelectorAll<HTMLElement>(definition.selector)
        .forEach((element) => {
          if (element.swiper) return;
          const instance = new Swiper(element, definition.options);
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            instance.autoplay?.stop();
          instances.current.push(instance);
        });
    }
  }, []);
  useEffect(() => {
    if (scriptLoaded) initialize();
    return () => {
      instances.current.forEach((instance) => instance.destroy(true, true));
      instances.current = [];
    };
  }, [initialize, pathname, scriptLoaded]);
  return (
    <Script
      src="/assets/js/lib/swiper.min.js"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  );
}
