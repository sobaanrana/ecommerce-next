import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: string[]; // An array of image URLs
}

export const ImageSlider = ({ images }: ImageSliderProps) => {
  // const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [swiper, setSwiper] = useState<unknown>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (images?.length ?? 0) - 1,
  });

  // Handle slide change and update activeIndex and slideConfig
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    setSlideConfig({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactiveStyles = "hidden text-gray-400";

  return (
    <div className="w-full h-full group relative bg-zinc-400 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd,
          })}
          aria-label="next image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isBeginning,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isBeginning,
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={0} // Ensure no gap between slides
        loop={true} // Optional: enable looping
        onSlideChange={handleSlideChange} // Handle slide change directly
        onSwiper={setSwiper} // Set swiper instance
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index} className="-z-10 relative h-full w-full">
            <Image
              width={200}
              height={200}
              loading="eager"
              className="-z-10 h-full w-full object-cover object-center"
              src={image.url}
              alt={`Product image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
