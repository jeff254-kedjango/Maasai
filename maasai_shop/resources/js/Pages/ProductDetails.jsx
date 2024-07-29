import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/ProductDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faPlus, faArrowUpLong, faExpand, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@inertiajs/react';
import { useCart } from '../Pages/CartContext';

function ProductDetails() {

    const { addToCart } = useCart();

    const { product, relatedProducts, categories, auth } = usePage().props;

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

    const calculateOffer = (sale_price, price) => {
        const diff = (price - sale_price);
        return Math.ceil((diff / price) * 100);
    };


    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    // Create an array of image URLs
    const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean); // Filter out null/undefined values

    return (
        <Layout auth={auth}>
            <Head title="Product Details" />
            <div className={styles.ProductDetailsSection}>
                <div className={styles.ProductDetailsContainer}>
                    <div className={styles.ProductDetailsVideoContainerDetailsName}>
                        <h3>{product.name}.</h3>
                    </div>
                    <div className={styles.ProductDetailsImageContainer}>
                        {images.map((image, index) => (
                            <div key={index} className={styles.ProductDetailsImage}>
                                <img src={`/storage/${image}`} className={styles.ProductDetailsImageDisplay} alt={product.name} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.ProductDetailsVideoContainer}>
                        {product.video && <video src={`/storage/${product.video}`} className={styles.ProductDetailsVideo} controls />}
                        <div className={styles.ProductDetailsVideoContainerDetails}>
                            <div className={styles.ProductDetailsVideoContainerDetailsDesc}>
                                <h3>{product.description}</h3>
                            </div>
                            <div className={styles.ProductDetailsVideoContainerDetailsSpecs}>
                                {product.sale_price != null ? 
                                    <div className={styles.ProductDetailsVideoContainerDetailsPrice}>
                                        <h3 className={styles.ProductDetailsVideoContainerDetailsPriceprice}><span>Kes </span>{formatNumber(product.price)}</h3>
                                        {product.sale_price &&
                                            <h3 className={styles.ProductDetailsVideoContainerDetailsSalePrice}><span>Kes </span>{formatNumber(product.sale_price)}</h3>}
                                    </div>
                                :
                                    <div className={styles.ProductDetailsVideoContainerDetailsPrice}>
                                        <h3 className={styles.ProductDetailsVideoContainerDetailsSalePrice}><span>Kes </span>{formatNumber(product.price)}</h3>
                                    </div>
                                }
                                <div className={styles.ProductDetailsVideoContainerDetailsOrder}>
                                    <button onClick={() => handleAddToCart(product)} >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <h2 className={styles.RelatedProductsTitle} >Related Products</h2>
                    <div  className={styles.ProductListDisplayContainer} >
                        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
                            relatedProducts.map((element) => (
                                <div key={element.id} className={styles.ProductListDisplayCard}>
                                    <div className={styles.ProductListDisplayImage}>
                                        {element.sale_price && element.price > element.sale_price &&
                                            <div className={styles.offerDisplay}>
                                                <medium>{calculateOffer(element.sale_price, element.price)}%</medium>
                                                <small>off</small>
                                            </div>
                                        }
                                        {element.quantity &&
                                            <div className={styles.StockContainerGreen}>
                                                <FontAwesomeIcon icon={faArrowUpLong} />
                                                <small>stock</small>
                                            </ div>
                                        }
                                        {element.quantity < 10 &&
                                            <div className={styles.StockContainerRed}>
                                                <FontAwesomeIcon icon={faArrowUpLong} />
                                                <small>stock</small>
                                            </ div>
                                        }
                                        <img src={`${baseUrl}/storage/${element.image1}`} alt={element.name} />
                                    </div>
                                    <div className={styles.ProductListDisplayTitle}>
                                        <p>{element.name}</p>
                                    </div>
                                    <div className={styles.ProductListDisplayDetails}>
                                        {element.sale_price && element.price > element.sale_price ? 
                                            <div className={styles.ProductListDisplayPrice}>
                                                <p className={styles.ProductListDisplayPriceSP}>Kes {formatNumber(element.price)}</p>
                                                <p className={styles.ProductListDisplayPriceP}>Kes {formatNumber(element.sale_price)}</p>
                                            </div>
                                            :
                                            <div className={styles.ProductListDisplayPrice}>
                                                <p className={styles.ProductListDisplayPriceP}>Kes {formatNumber(element.price)}</p>
                                            </div>
                                        }
                                        <Link href={route('show-detail.product', { id: element.slug })}>
                                            <div className={styles.ProductListDisplayEdit}>
                                                <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faExpand} />
                                                <p>View</p>
                                            </div>
                                        </Link>
                                        <div className={styles.ProductListDisplayDelete} onClick={() => handleAddToCart(element)}>
                                            <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPlus} />
                                            <p>Order</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {
                            relatedProducts.length == 0 &&  
                            <div className={styles.NoProductListDisplayCard}>
                                <h4>Nothing to Display....</h4>
                                <p> Adjust your Filters or refresh the Page if it's a Network error.</p>
                            </div>
                
                        }
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetails;




// {product.video != null &&

// }


