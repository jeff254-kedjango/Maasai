import React, {useState} from 'react'
import styles from '../../../css/components/ProductList.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Link, usePage, router } from '@inertiajs/react';


function ProductList({ setShow, products }) {

    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(15);

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
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


    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

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
                            <div className={styles.ProductListDisplayPrice}>
                                <p className={styles.ProductListDisplayPriceSP}>{element.sale_price}</p>
                                <p className={styles.ProductListDisplayPriceP}>{element.price}</p>
                            </div>
                            <Link href={route('admin.edit-product', { id: element.id })}>
                                <div className={styles.ProductListDisplayEdit}>
                                    <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPenToSquare} />
                                    <p>Edit</p>
                                </div>
                            </Link>
                            <Link
                                as="button"
                                method="delete"
                                href={route('admin.destroy-product', { id: element.id })}
                                type="button"
                            >
                                <div className={styles.ProductListDisplayDelete}>
                                    <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faTrashCan} />
                                    <p>Delete</p>
                                </div>
                            </Link>
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
        </div>
    </div>
  )
}

export default ProductList