import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../../css/category.css';
import styles from '../../../css/components/ShopCategory.module.css';

function ShopCategory({ categories }) {
  return (
    <div className={styles.ShopCategorySection}>
        <div className={styles.ShopCategoryContainer}>
            <h2>Categories</h2>
            <Swiper
                slidesPerView={5}
                spaceBetween={10}
                navigation={true} 

                autoplay={{
                    delay: 5000,
                    disableOnInteraction: true,
                }}

                modules={[Navigation, Autoplay ]}
                className="category-Swiper"
            >
            {categories && categories.map((category, index) => (
                <SwiperSlide key={index} className="swiper-container-category">
                    <div className="swiper-slide-cat-image">
                        <img src={`/storage/${category.image}`} alt={category.name} />
                    </div>
                    <div className="swiper-slide-details-cat">
                        <small>{category.name}</small>
                    </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    </div>
  );
}

export default ShopCategory;