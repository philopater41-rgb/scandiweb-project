import React, { useState } from 'react';
import { Arrow } from './';

interface ProductImageCarouselProps {
  images?: string[];
  alt?: string;
}

function ProductImageCarousel({ images = [], alt = 'Product' }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImageHeight, setMainImageHeight] = useState<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (images.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (images.length || 1)) % (images.length || 1));
  };

  const handleMainImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { clientHeight } = e.currentTarget;
    const maxHeightRatio = 0.6;
    const maxHeight = window.innerHeight * maxHeightRatio;
    const calculatedHeight = Math.min(clientHeight, maxHeight);

    setMainImageHeight(calculatedHeight);
  };

  return (
    <section className="mb-6 md:w-2/3 md:mb-0" data-testid="product-gallery">
      {!!images?.length && (
        <div className="relative flex">
          <div
            className="w-1/5 max-h-screen overflow-y-auto"
            style={{ maxHeight: mainImageHeight || undefined }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={alt}
                className={`w-full ${
                  index === currentIndex ? 'opacity-50' : 'opacity-100'
                } cursor-pointer`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <div className="relative w-4/5">
            <img
              src={images[currentIndex]}
              alt={alt}
              className="object-contain w-full h-auto"
              onLoad={handleMainImageLoad}
              style={{ maxHeight: mainImageHeight || '100vh' }}
            />

            <button
              className="absolute p-2 text-gray-300 transition-colors duration-300 transform -translate-y-1/2 bg-text top-1/2 left-4 hover:text-white"
              onClick={handlePrev}
            >
              <Arrow direction="left" />
            </button>
            <button
              className="absolute p-2 text-gray-300 transition-colors duration-300 transform -translate-y-1/2 bg-text top-1/2 right-4 hover:text-white"
              onClick={handleNext}
            >
              <Arrow />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductImageCarousel;
