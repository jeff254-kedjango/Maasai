import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from 'swiper/modules';
import { formatNumber } from "@/utils/formatNumber";
// Import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import '../../../css/app.css';
import '../../../css/offer.css'; // Custom CSS for the component

function MainPicCarousel({ products }) {
  return (
    <>
      <Swiper 
        className="my-Swiper"
        navigation={true} 
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
      >
        {products && products.map((product, index) => (
          <SwiperSlide key={index} className="swiper-container-pic">
            <div  className="swiper-slide-image" >
              <img src={`/storage/${product.image2}`} alt={product.name}/>
            </div>
            <div className="swiper-slide-details">
              <div className="title-container">
               <small>{product.name}</small>
              </div>
              <div className="price-container">
                <p>Kes</p>
                { formatNumber(product.price) }
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default MainPicCarousel;