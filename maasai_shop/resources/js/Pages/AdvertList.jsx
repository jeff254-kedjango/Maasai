import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import styles from '../../css/components/AdvertList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import LoaderAnimation from '../Components/Lotie/LoaderAnimation';

const AdvertList = ({ adverts, setShow }) => {
    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(4);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const ads = adverts ? adverts.slice(start, end) : [];
    const pages = adverts ? Math.ceil(adverts.length / 4) : [];

    const handlePagination = (e) => {
        setEnd(e * 4);
        setStart((e * 4) - 4);
    };

    const handleClick = () => {
        const numberValue = parseInt(inputValue, 10);
        if (!isNaN(numberValue)) {
            if (numberValue <= pages && numberValue > 0) {
                setInputValue(numberValue);
                handlePagination(numberValue);
            }
        } else {
            console.error('Please enter a valid number');
        }
    };

    const handleDeleteClick = (advert) => {
        setSelectedAdvert(advert);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedAdvert) {
            setLoading(true); // Show loader
            router.delete(route('admin.adverts.destroy', { id: selectedAdvert.id }), {
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
                    <h3>Adverts</h3>
                    <Link href={route('admin.adverts.create')}>
                        <div className={styles.AddProductButton}>
                            <FontAwesomeIcon icon={faPlus} />
                            <p>Add Advert</p>
                        </div>
                    </Link>
                </div>
                <div className={styles.ProductListIcon}>
                    <FontAwesomeIcon onClick={() => setShow(0)} className={styles.ProductListIconIcon} icon={faChevronUp} />
                </div>
            </div>
            <div className={styles.ProductListDisplaySection}>
                {ads.length > 0 ?
                    <div className={styles.ProductListDisplayContainer}>
                        {ads.map(advert => (
                            <div key={advert.id} className={styles.ProductListDisplayCard}>
                                <div className={styles.AdvertDisplayCard}>
                                    {advert.video != null ?
                                        <div className={styles.AdvertVideoDisplayContainer}>
                                            <video className={styles.AdvertVideoDisplay} src={`/storage/${advert.video}`} controls />
                                        </div>
                                        :
                                        <div className={styles.AdvertImageDisplayContainer}>
                                            <img src={`/storage/${advert.image}`} className={styles.AdvertImageDisplay} alt={advert.title} />
                                        </div>
                                    }
                                </div>
                                <div className={styles.AdvertDetails}>
                                    <div className={styles.AdvertDetailsTitle}>
                                        <medium>{advert.title}</medium>
                                    </div>
                                    <div className={styles.AdvertDetailsIcons}>
                                        <Link href={route('admin.adverts.edit', { id: advert.id })}>
                                            <div className={styles.ProductListDisplayEdit}>
                                                <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faPenToSquare} />
                                                <p>Edit</p>
                                            </div>
                                        </Link>
                                        <div onClick={() => handleDeleteClick(advert)} className={styles.ProductListDisplayDelete}>
                                            <FontAwesomeIcon className={styles.ProductListDisplayIcons} icon={faTrashCan} />
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className={styles.NoProductListDisplayCard}>
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
                            value={inputValue >= 1 && inputValue <= pages && inputValue}
                            onChange={handleInputChange}
                            placeholder="Page"
                        />
                    </div>
                    <p>Page {inputValue} / {pages}</p>
                </div>
                :
                <></>
            }

            {showModal && (
                <div className={styles.ConfirmationModal}>
                    <div className={styles.ConfirmationContent}>
                        <p>Are you sure you want to delete <span>{selectedAdvert?.title}</span>?</p>
                        {loading && <LoaderAnimation />} {/* Show loader when loading */}
                        <button className={styles.ConfirmationConfirm} onClick={handleConfirmDelete}>Confirm</button>
                        <button className={styles.ConfirmationCancel} onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertList;