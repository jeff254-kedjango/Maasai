import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useCart } from '../../Pages/CartContext';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../../css/category.css';
import '../../../css/newStock.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus, faSort,  faArrowUpLong, faExpand } from '@fortawesome/free-solid-svg-icons';

import { Link, usePage, router } from '@inertiajs/react';
import Confirmation from '../Lotie/Confirmation';

function NewStock({ products }) {
  const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

  const { addToCart } = useCart();

  const [isActive, setIsActive] = useState(false);
  const [handleId, setHandleId] = useState(null);

  const handleToggle = () => {
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
      setHandleId(null)
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    handleToggle();
    setHandleId(product.id)
  };

  const calculateOffer = ( sale_price , price ) => {
    const diff = ( price - sale_price )
    return Math.ceil((diff / price ) * 100)
  }

  function formatNumber(number) {
      return new Intl.NumberFormat().format(number);
  }

  return (
    <div className='new-stock-container'>
        <h2>NEW STOCK.</h2>
        <div className='new-stock-section'>
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            navigation={true} 

            autoplay={{
                delay: 3000,
                disableOnInteraction: true,
            }}

            modules={[Navigation, Autoplay ]}
            className="category-Swiper"
          >
            {products && products.map((element, index) => (
              <SwiperSlide key={index} className="newstock-display-container">
                <div className='newstock-image'>
                  {
                      element.sale_price && element.price > element.sale_price && 
                      <div className="offerDisplay">
                          <medium>{calculateOffer(element.sale_price, element.price )}%</medium>
                          <small>off</small>
                      </div>
                  }
                  { element.quantity && 
                    <div className="StockContainerGreen">
                      <FontAwesomeIcon icon={faArrowUpLong} />
                      <small>stock</small>
                    </ div> 
                  }
                  { element.quantity < 10 && 
                    <div className="StockContainerRed">
                      <FontAwesomeIcon icon={faArrowUpLong} />
                      <small>stock</small>
                    </ div> 
                  }
                  <img src={`${baseUrl}/storage/${element.image1}`} alt={element.name} />
                </div>
                <div className='newstock-display-title'>
                  <p>{element.name}</p>
                </div>
                <div className='newstock-display-details'>
                  {
                    element.sale_price && element.price > element.sale_price ?
                    <div className='ProductListDisplayPrice'>
                      <p className="ProductListDisplayPriceSP">{formatNumber(element.price)}</p>
                      <p className="ProductListDisplayPriceP">{formatNumber(element.sale_price)}</p>
                    </div>                                    
                    :
                    <div className="ProductListDisplayPrice">
                      <p className="ProductListDisplayPriceP">{formatNumber(element.price)}</p>
                    </div>
                  }
                  <Link href={route('show-detail.product', { id: element.slug })}>
                      <div className="ProductListDisplayEdit">
                          <FontAwesomeIcon className="ProductListDisplayIcons" icon={faExpand} />
                          <p>View</p>
                      </div>
                  </Link>
                  { element.id != handleId &&
                    <div className="ProductListDisplayDelete" onClick={() => handleAddToCart(element)}>
                      <FontAwesomeIcon className="ProductListDisplayIcons" icon={faPlus} />
                      <p>Order</p>
                    </div>
                  }
                  { isActive && element.id == handleId &&
                    <div className="ProductListDisplayDelete" onClick={() => handleAddToCart(element)}>
                      < Confirmation />
                    </div>
                  }
                </div>
              </SwiperSlide>
            ))} 
          </Swiper>
        </div>
    </div>
  )
}

export default NewStock