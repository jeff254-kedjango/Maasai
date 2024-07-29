import React, {useState} from 'react';
import Layout from '../Layouts/Layout';
import { Link, Head } from '@inertiajs/react';
import MainVidCarousel from '@/Components/ShopComponents/MainVidCarousel';
import CubeCarousel from '@/Components/ShopComponents/CubeCarousel';
import MainPicCarousel from '@/Components/ShopComponents/MainPicCarousel';
import styles from '../../css/Shop.module.css'
import ShopCategory from '@/Components/ShopComponents/ShopCategory';
import ProductsDisplay from '@/Components/ShopComponents/ProductsDisplay';
import NewStock from '@/Components/ShopComponents/NewStock';
import Offers from '@/Components/ShopComponents/Offers';

function Shop({ orders, products, adverts, categories, newOrders, newStock, offers, error }) {
  
  // console.log('orders', orders);
  // console.log('products', products);
  // console.log('adverts', adverts);
  // console.log('categories', categories);
  // console.log('newOrders', newOrders);
  // console.log('newStock', newStock);
  
  
  return (
    <Layout>
      <Head title="Shop" />
      <div className={styles.ShopContainer}>
        {error && <p>{error}</p>}
        <div className={styles.ShopAdvertSection}>
          <div className={styles.ShopAdvertVidContainer}>
            < MainVidCarousel adverts={adverts} />
          </div>
          <div className={styles.ShopAdvertPicsContainer}>
            <div className={styles.ShopAdvertCubeContainer}>
              <h5>New Stock</h5>
              < CubeCarousel products={products} />
            </div>
            <div className={styles.ShopAdvertBannerContainer}>
              <h5>Offers</h5>
              < MainPicCarousel products={products} />
            </div>
          </div>
        </div>
        < ShopCategory categories={categories} />
        < ProductsDisplay products={products} />
        < NewStock products={newStock} />
        < Offers products={offers} />
      </div>
    </Layout>
  )
}

export default Shop