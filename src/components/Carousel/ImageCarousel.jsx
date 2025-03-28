import PropTypes from 'prop-types';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "../ui/carousel";
import React from 'react';
import { motion } from 'framer-motion';
import Carousel2 from "/carousel-12.png";
import Carousel1 from "/Carousel-18.png";
import Carousel3 from "/carousel-13.png";

const ImageCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const images = [
    { src: Carousel1, alt: "Carousel Image 1" },
    { src: Carousel2, alt: "Carousel Image 2" },
    { src: Carousel3, alt: "Carousel Image 3" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full bg-gray-50 dark:bg-gray-900"
        onMouseEnter={plugin.current.isPlaying}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1,
                  transition: { duration: 0.2 }
                }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 md:h-96 object-contain"
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </motion.div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ).isRequired,
  autoplay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
};

export default ImageCarousel;
