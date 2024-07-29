import React, {useState} from 'react'
import styles from '../../../css/components/ProductList.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Link, usePage, router } from '@inertiajs/react';
import LoaderAnimation from '../Lotie/LoaderAnimation';

function ProductList({ setShow, products }) {

    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(15);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }
  
    const prod = products ? products.slice(start, end) : [];

    const pages = products ? Math.ceil(products.length / 15 ) : 0

    const handlePagination = (e) => {
        setEnd(e * 15 );
        setStart((e*15)- 15 );
    }

    const handleClick = () => {
      const numberValue = parseInt(inputValue, 10); // Parse the input to a number
      if (!isNaN(numberValue)) { // Check if it's a valid number
        // Update state with the parsed number
        if(numberValue <= pages && numberValue > 0 ) {
            setInputValue(numberValue);
            handlePagination(numberValue) 
        }
      } else {
        // Handle invalid input (optional)
        // console.error('Please enter a valid number');
      }

    };


    const handleDeleteClick = (element) => {
        setSelectedAdvert(element);
        setShowModal(true);
    };

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    const handleConfirmDelete = () => {
        if (selectedAdvert) {
            setLoading(true); // Show loader
            router.delete(route('admin.destroy-product', { id: selectedAdvert.id }), {
                preserveState: true,
                onSuccess: () => {
                    setLoading(false); // Hide loader
                    setShowModal(false);
                    setSelectedAdvert(null);
                },
                onError: (errors) => {
                    setLoading(false); // Hide loader
                    console.error('Error:', errors);
                }
            });
        }
    };


  return (
    <div className={styles.ProductListSection}>
        <div className={styles.ProductListContainer}>
            <div className={styles.ProductListTitle}>
                <h3>Products</h3>
                <Link href='/admin/create-product'>
                    <div className={styles.AddProductButton}> 
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Add Product</p>
                    </div>                
                </Link>
            </div>
            <div className={styles.ProductListIcon}>
                <FontAwesomeIcon onClick={()=>setShow(0)} className={styles.ProductListIconIcon} icon={faChevronUp} />
            </div>
        </div>
        <div className={styles.ProductListDisplaySection}>
            <div className={styles.ProductListDisplayContainer}>
                {prod && prod.map((element) => (
                    <div key={element.id} className={styles.ProductListDisplayCard}>
                        <div className={styles.ProductListDisplayImage}>
                            <img src={`${baseUrl}/storage/${element.image1}`} alt={element.name} />
                        </div>
                        <div className={styles.ProductListDisplayTitle}>
                            <p>{element.name}</p>
                        </div>
                        <div className={styles.ProductListDisplayDetails}>
                                {element.sale_price ? 
                                    <div className={styles.ProductListDisplayPrice}>
                                        <p className={styles.ProductListDisplayPriceSP}>Kes  {formatNumber(element.price)} </p>
                                        <p className={styles.ProductListDisplayPriceP}>Kes{formatNumber(element.sale_price)}</p>
                                    </div>
                                    :
                                    <div className={styles.ProductListDisplayPrice}>
                                        <p className={styles.ProductListDisplayPriceP}>Kes {formatNumber(element.price)}</p>
                                    </div>
                                }
                            <Link href={route('admin.edit-product', { id: element.id })}>
                                <div className={styles.ProductListDisplayEdit}>
                                    <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPenToSquare} />
                                    <p>Edit</p>
                                </div>
                            </Link>
                            <div onClick={() => handleDeleteClick(element)} className={styles.ProductListDisplayDelete}>
                                <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faTrashCan} />
                                <p>Delete</p>
                            </div>
                        </div>
                    </div>
                ))}
                {prod.length == 0 &&
                    <div className={styles.NoProductListDisplayCard} > 
                        <p>Nothing to Display. Refresh Page if it's a network error.</p>
                    </div> 
                }
            </div>
            <div className={styles.ProductListDisplayPagination}>
                <div className={styles.PaginationContainer}>
                    <button onClick={handleClick}>Submit</button>
                    <input
                        type="number"
                        value={inputValue >= 1 && inputValue <= pages && inputValue }
                        onChange={handleInputChange}
                        placeholder="Page"
                    />
                </div>
                <p>Page {inputValue} / {pages} </p>
            </div>

            {showModal && (
                <div className={styles.ConfirmationModal}>
                    <div className={styles.ConfirmationContent}>
                        <p>Are you sure you want to delete <span>{selectedAdvert?.name}</span>?</p>
                        {loading && <LoaderAnimation />} {/* Show loader when loading */}
                        <button className={styles.ConfirmationConfirm} onClick={handleConfirmDelete}>Confirm</button>
                        <button className={styles.ConfirmationCancel} onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    </div>
  )
}

export default ProductList