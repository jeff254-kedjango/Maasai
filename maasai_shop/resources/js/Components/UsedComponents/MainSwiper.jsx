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

import logo from '../../../images/zoe-clear.png'

import LoaderAnimation from "../Lotie/LoaderAnimation";


const MainSwiper = () => {
  return (
    <div className={styles.swiperContainer}>
      <div className={styles.foreground}>
        <div className={styles.missionStatement}>
          <img className={styles.LogoImg} src={logo} alt="Zoe's Baby Shop" />
          < LoaderAnimation />
        </div>
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default MainSwiper;
