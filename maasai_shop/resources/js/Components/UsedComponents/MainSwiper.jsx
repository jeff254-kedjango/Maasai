import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, usePage } from '@inertiajs/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from '../../../css/components/MainSwiper.module.css';
import pic1 from '../../../images/LayoutPics/pic1.jpg';
import pic2 from '../../../images/LayoutPics/pic2.jpg';
import pic3 from '../../../images/LayoutPics/pic3.jpg';
import pic4 from '../../../images/LayoutPics/pic4.jpg';
import pic5 from '../../../images/LayoutPics/pic5.jpg';

import logo from '../../../images/logo.webp'


const MainSwiper = () => {
  return (
    <div className={styles.swiperContainer}>
      <div className={styles.foreground}>
        <div className={styles.missionStatement}>
          <div className={styles.LogoContainer}>
            <img className={styles.LogoImg} src={logo} alt="Maasai Logo" />
          </div>
          <div className={styles.LogoStatement}>
            <h2>Where Elegance Meets Vintage & Style.</h2>
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.buttonsContainer}>
            <Link href='/shop' className={styles.button}>Shop</Link>
            <Link href='/about' className={styles.button}>About</Link>
            <Link href='/contacts' className={styles.button}>Contact Us</Link>
          </div>
        </div>
      </div>
      <div className={styles.overlay}></div>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        className={styles.swiper}
      >
        <SwiperSlide>
          <img src={pic1} alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={pic2} alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={pic3} alt="Slide 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={pic4} alt="Slide 4" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={pic5} alt="Slide 5" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default MainSwiper;
