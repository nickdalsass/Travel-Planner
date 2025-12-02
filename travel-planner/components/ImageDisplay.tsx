"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ImageDisplay = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      startIndex: 1,
      align: "center",
    },
    [Autoplay({delay: 4000, stopOnInteraction: false})]
  );


  return (
    <div className="slide-element">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/city-street.jpg"
              alt="City Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Make Changes to Your Trips</span>
            </div>
          </div>

          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/cable-car.jpg"
              alt="Cable-car Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem"}}
              draggable={false}
            />
            <span className="image-text">Easily Store Travel Information in One Place</span>
            </div>
          </div>

          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/new-york-city.jpg"
              alt="City Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Plan Your Trip with a Date and Destination</span>
            </div>
          </div>
          
          <div className="embla__slide">
            <div className="image-wrapper">
            <Image  
              src="/images/snow-mountains.jpg"
              alt="Snowy Mountains Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">View All Your Created Trips</span>
            </div>
          </div>

          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/arial-city.jpg"
              alt="Arial City Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Include Itineraries as Desired</span>
            </div>
          </div>

          <div className="embla__slide">
            <div className="image-wrapper">
            <Image
              src="/images/airplane.jpg"
              alt="Airplane Image"
              width={550}
              height={700}
              style={{ borderRadius: "2rem" }}
              draggable={false}
            />
            <span className="image-text">Share Specific Trips with Loved Ones!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageDisplay;
