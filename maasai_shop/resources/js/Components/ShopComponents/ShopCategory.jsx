import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../../css/category.css';
import styles from '../../../css/components/ShopCategory.module.css';
import { Link } from '@inertiajs/react';


function ShopCategory({ categories }) {
  return (
    <div className={styles.ShopCategorySection}>
        <div className={styles.ShopCategoryContainer}>
            <h2>CATEGORIES.</h2>
            <Swiper
                slidesPerView={6}
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
                    <Link href={route('shop-categories.show', { category: category.id })}>
                        <div className="swiper-slide-cat-image">
                            <img src={`/storage/${category.image}`} alt={category.name} />
                        </div>
                        <div className="swiper-slide-details-cat">
                            <small>{category.name}</small>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    </div>
  );
}

export default ShopCategory;