"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ImageDisplay = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      /*align: "center",
      skipSnaps: true,
      startIndex: 1,
      watchDrag: false,*/
      align: "center",
      loop: true,
      skipSnaps: false,
    },
    //[Autoplay()]
    [Autoplay({delay:4000, stopOnInteraction: false})]
  );


  return (
    <div className="slide-element">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              /*src="/images/bus.jpg"
                alt="Bus Image"*/
              src="/images/cable-car.jpg"
              alt="Cable-car Image"
              /*width={525}
              height={700}*/
              width={700}
              height={700}
              style={{ borderRadius: "2rem"}}
              draggable={false}
            />
            <span className="image-text">Easily store travel information in one spot</span>
            </div>
          </div>
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              /*src="/images/fancy-hotel.jpg"
              alt="Hotel Image"*/
              src="/images/new-york-city.jpg"
              alt="City Image"
              width={700}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Plan your trip with a date and destination</span>
            </div>
          </div>
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/arial-city.jpg"
              alt="Arial City Image"
              width={700}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Include itineraries as desired</span>
            </div>
          </div>
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image  
              src="/images/snow-mountains.jpg"
              alt="Snowy Mountains Image"
              width={700}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">View all created trips</span>
            </div>
          </div>
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/city-street.jpg"
              alt="City Image"
              width={700}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Make changes to your trips</span>
            </div>
          </div>
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/airplane.jpg"
              alt="Airplane Image"
              width={700}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Share specific trips with loved ones!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageDisplay;
