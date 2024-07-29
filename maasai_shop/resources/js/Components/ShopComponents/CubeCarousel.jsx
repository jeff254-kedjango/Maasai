import React, { useEffect, useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import styles from '../../../css/components/CubeCarousel.module.css'

// import required modules
import { EffectCube, Pagination, Autoplay } from 'swiper/modules';
import '../../../css/styles.css';
import resizeImage from './resizeImage';
import { formatNumber } from "../../utils/formatNumber";


function CubeCarousel({products}) {

  const [resizedImages, setResizedImages] = useState([]);

  useEffect(() => {
    const resizeAllImages = async () => {
      const resized = await Promise.all(
        products.map(async (product) => {
          const resizedImageBlob = await resizeImage(`/storage/${product.image1}`, 800, 600);
          return {
            ...product,
            resizedImageUrl: URL.createObjectURL(resizedImageBlob),
          };
        })
      );
      setResizedImages(resized);
    };

    resizeAllImages();
  }, [products]);

  return (
    <>
      <Swiper
        effect={'cube'}
        grabCursor={true}
        lazy={true}
        cubeEffect={{
            shadow: false,
            slideShadows: false,
            shadowOffset: 20,
            shadowScale: 0.5,
        }}
        autoplay={{
            delay: 4000,
            disableOnInteraction: false,
        }}
        modules={[EffectCube, Pagination, Autoplay]}
        className="mySwiper"
      >
        {resizedImages && resizedImages.map((advert, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-container">
              <img
                className="swiper-lazy"
                src={advert.resizedImageUrl}
                alt={advert.name}
                loading="lazy"
              />
              <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
              <div className="swiper-details">
                <h2>{advert.name}</h2>
                <p> Kes {formatNumber(advert.price)}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default CubeCarousel;

