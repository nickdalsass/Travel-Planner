"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ImageDisplay = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      align: "center",
      dragFree: false,
      startIndex: 1,
    },
    [Autoplay()]
  );

  return (
    <div className="slide-element">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <Image
              src="/images/bus.jpg"
              alt="Bus Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
          <div className="embla__slide">
            <Image
              src="/images/fancy-hotel.jpg"
              alt="Hotel Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
          <div className="embla__slide">
            <Image
              src="/images/arial-city.jpg"
              alt="Arial City Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
          <div className="embla__slide">
            <Image  
              src="/images/snow-mountains.jpg"
              alt="Snowy Mountains Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
          <div className="embla__slide">
            <Image
              src="/images/city-street.jpg"
              alt="City Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
          <div className="embla__slide">
            <Image
              src="/images/airplane.jpg"
              alt="Airplane Image"
              width={525}
              height={700}
              style={{ borderRadius: "2rem" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageDisplay;
