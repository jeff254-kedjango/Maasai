import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import styles from '../../css/components/AdvertList.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';



const AdvertList = ({ adverts, setShow }) => {

    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(4);

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
    
    const ads = adverts ? adverts.slice(start, end) : [] ;

    const pages = adverts ? Math.ceil(adverts.length / 4 ) : [];

    const handlePagination = (e) => {
        setEnd(e * 4 );
        setStart((e*4)- 4 );
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
        console.error('Please enter a valid number');
      }

    };

    console.log('adverts',adverts)

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';



    return (
        <div className={styles.ProductListSection}>
            <div className={styles.ProductListContainer}>
                <div className={styles.ProductListTitle}>
                    <h3>Adverts</h3>
                    <Link href={route('admin.adverts.create')}>
                        <div className={styles.AddProductButton}> 
                            <FontAwesomeIcon icon={faPlus} />
                            <p>Add Advert</p>
                        </div>                
                    </Link>
                </div>
                <div className={styles.ProductListIcon}>
                    <FontAwesomeIcon onClick={()=>setShow(0)} className={styles.ProductListIconIcon} icon={faChevronUp} />
                </div>
            </div>
            <div className={styles.ProductListDisplaySection}>
                {ads.length > 0 ? 
                    <div className={styles.ProductListDisplayContainer} > 
                        {ads.map(advert => (
                            <div key={advert.id} className={styles.ProductListDisplayCard}>
                                <div className={styles.AdvertDisplayCard}>
                                    {advert.video != null ? 
                                        <div className={styles.AdvertVideoDisplayContainer}>
                                            <video src={`/storage/${advert.video}`} controls />
                                        </div> 
                                        :
                                        <div className={styles.AdvertImageDisplayContainer}>
                                            <img src={`/storage/${advert.image}`} className={styles.AdvertImageDisplay} alt={advert.title} />
                                        </div>
                                    }
                                </div>
                                <div className={ styles.AdvertDetails }>
                                    <div className={ styles.AdvertDetailsTitle }>
                                        <medium>{ advert.title }</medium>
                                    </div>
                                    <div className={ styles.AdvertDetailsIcons } >
                                        <Link href={route('admin.adverts.edit', { id: advert.id })}>
                                            <div className={styles.ProductListDisplayEdit}>
                                                <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPenToSquare} />
                                                <p>Edit</p>
                                            </div>
                                        </Link>
                                        <Link
                                            as="button"
                                            method="delete"
                                            href={route('admin.adverts.destroy', { id: advert.id })}
                                        >
                                            <div className={styles.ProductListDisplayDelete}>
                                                <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faTrashCan} />
                                                <p>Delete</p>
                                            </div>
                                        </Link>                                    
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className={styles.NoProductListDisplayCard} >
                        <p>No Adverts to Show</p>
                    </div>
                }
            </div>
            {adverts.length > 0 ? 
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
            :
            <></>            
        }
        </div>
    );
};

export default AdvertList;
