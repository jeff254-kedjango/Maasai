import React, { useState } from 'react';
import styles from '../../css/BlogList.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Link, usePage, router } from '@inertiajs/react';



function BlogList({setShow, blogs}) {

    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const prod = blogs ? blogs.slice(start, end) : [];

    const pages = blogs ? Math.ceil(blogs.length / 10 ) : 0

    const handlePagination = (e) => {
        setEnd(e * 10 );
        setStart((e*10)- 10 );
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
                <h3>Blogs</h3>
                <Link href="/admin/blogs/create">
                    <div className={styles.AddProductButton}>
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Add Blog</p>
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
                            <img src={`${baseUrl}/storage/${element.image}`} alt={element.title} />
                        </div>
                        <div className={styles.ProductListDisplayTitle}>
                            <p>{element.title}</p>
                        </div>
                        <div className={styles.ProductListDisplayDetails}>
                            <div className={styles.ProductListDisplayPrice}>
                                {/* <p className={styles.ProductListDisplayPriceSP}>{element.sale_price}</p> */}
                                {/* <p className={styles.ProductListDisplayPriceP}>{element.editor}</p>
                                <p className={styles.ProductListDisplayPriceP}>{element.updated_at}</p> */}
                            </div>
                            <Link href={route('blogs.edit', { id: element.slug })}>
                                <div className={styles.ProductListDisplayEdit}>
                                    <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPenToSquare} />
                                    <p>Edit</p>
                                </div>
                            </Link>
                            <Link
                                as="button"
                                method="delete"
                                href={route('blogs.destroy', { id: element.slug })}
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

export default BlogList