import React from 'react';
import styles from '../../../css/components/FeaturedProducts.module.css';

export default function FeaturedProducts({ products }) {
    console.log(products);
  
    const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
  
    return (
      <div className={styles.prductsSection}>
        <div className={styles.productsContainer}>
          {products.length !== 0 ? (
            <div className={styles.products}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={`${baseUrl}/storage/${product.image1}`} alt={product.name} />
                  </div>
                  <div>
                    <div>
                      <h2>{product.name}</h2>
                    </div>
                    <div>
                      <p>{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProducts}>
              <h2>No products to display. Please come back later.</h2>
            </div>
          )}
          {products.length > 15 ? (
            <div className={styles.pagination}>
              <p>Pagination</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
