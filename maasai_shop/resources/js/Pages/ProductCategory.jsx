import React, { useState, useRef } from 'react';
import Layout from '../Layouts/Layout';
import styles from '../../css/ProductCategory.module.css';
import { useCart } from '../Pages/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faPlus, faArrowUpLong, faExpand, faTimes, faMagnifyingGlass  } from '@fortawesome/free-solid-svg-icons';
import { Link, usePage, Head } from '@inertiajs/react';
import Confirmation from '../Components/Lotie/Confirmation';


function ProductCategory() {
    const productsRef = useRef(null);
    const { category, products } = usePage().props;
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

    const formatNumber = (number) => {
        return new Intl.NumberFormat().format(number);
    };

    const calculateOffer = (sale_price, price) => {
        const diff = (price - sale_price);
        return Math.ceil((diff / price) * 100);
    };

    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(15);

    const [showModal, setShowModal] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const filteredProducts = products
        ? products.filter((product) => {
            const priceToCheck = product.sale_price !== null ? product.sale_price : product.price;
            const matchesMinPrice = minPrice ? priceToCheck >= Number(minPrice) : true;
            const matchesMaxPrice = maxPrice ? priceToCheck <= Number(maxPrice) : true;
            const matchesSearch = searchTerm ? new RegExp(searchTerm, 'i').test(product.name) : true;
            return matchesMinPrice && matchesMaxPrice && matchesSearch;
        }).slice(start, end)
        : [];

    const pages = products ? Math.ceil(products.length / 15) : 0;

    const handlePagination = (e) => {
        setEnd(e * 15);
        setStart((e * 15) - 15);
        productsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClick = () => {
        const numberValue = parseInt(inputValue, 10);
        if (!isNaN(numberValue)) {
            if (numberValue <= pages && numberValue > 0) {
                setInputValue(numberValue);
                handlePagination(numberValue);
            }
        }
    };

    const handleFilterSubmit = () => {
        setShowModal(false);
        setStart(0);
        setEnd(15);
    };

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    return (
        <Layout>
            <Head title="Shop Category" />
            <div className={styles.ProductCategorySection}>
                <div className={styles.ProductCategoryContainer}>
                    <div className={styles.ProductCategoryImage}>
                        <img src={`${baseUrl}/storage/${category.image}`} alt={category.name} />
                        <div className={styles.ProductCategoryOverlay}>
                            <div className={styles.ProductCategoryText}>
                                <h2>{category.name}.</h2>
                                <h5>{category.description}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.ProductListSection}>
                    <h5 ref={productsRef}>{category.name}</h5>
                    <div className={styles.ProductFilters} onClick={() => setShowModal(true)}>
                        <div className={styles.FiltersIcon}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <div className={styles.FiltersText}>
                            <p>Search & Filters</p>
                        </div>
                    </div>
                    <div className={styles.ProductListDisplaySection}>
                        <div className={styles.ProductListDisplayContainer}>
                            {filteredProducts && filteredProducts.map((element) => (
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
                                        { element.id != handleId &&
                                        <div className={styles.ProductListDisplayDelete} onClick={() => handleAddToCart(element)}>
                                            <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPlus} />
                                            <p>Order</p>
                                        </div>}
                                        { isActive && handleId==element.id &&
                                        <div className={styles.ProductListDisplayDelete} >
                                            <Confirmation className={styles.CartConfirmation} />
                                        </div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length == 0 &&
                            <div className={styles.NoProductListDisplayCard}>
                                <h4>Nothing to Display....</h4>
                                <p> Adjust your Filters or refresh the Page if it's a Network error.</p>
                            </div>
                        }
                        <div className={styles.ProductListDisplayPagination}>
                            <div className={styles.PaginationContainer}>
                                <button onClick={handleClick}>Submit</button>
                                <input
                                    type="number"
                                    value={inputValue >= 1 && inputValue <= pages ? inputValue : ''}
                                    onChange={handleInputChange}
                                    placeholder="Page"
                                />
                            </div>
                            <p>Page {inputValue} / {pages} </p>
                        </div>
                    </div>

                    {/* Modal for filters */}
                    {showModal && (
                        <div className={styles.Modal}>
                            <div className={styles.ModalContent}>
                                <div className={styles.ModalHeader}>
                                    <h2> Search & Filter</h2>
                                    <button onClick={() => setShowModal(false)} className={styles.CloseButton}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className={styles.ModalSearch}>
                                    <div className={styles.SearchFilterControl}>
                                        <label>Search:</label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.ModalBody}>
                                    <div className={styles.FilterControl}>
                                        <label>Min Price:</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.FilterControl}>
                                        <label>Max Price:</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.ModalFooter}>
                                        <button onClick={handleFilterSubmit} className={styles.ApplyButton}>
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default ProductCategory;