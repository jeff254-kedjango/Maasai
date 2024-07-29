import React, { useRef, useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import styles from "../../css/components/CategoryList.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import LoaderAnimation from '@/Components/Lotie/LoaderAnimation';



function CategoryList({ setShow, categories }) {
    const categoryRef = useRef(null);
    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    const [showModal, setShowModal] = useState(false);
    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const [loading, setLoading] = useState(false);

    const { delete: destroy } = useForm();

    const handleDeleteClick = (element, event) => {
        event.preventDefault(); // Prevent the default form submission
        setSelectedAdvert(element);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedAdvert) {
            setLoading(true); // Show loader
            router.delete(route('categories.destroy', { id: selectedAdvert.id }), {
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
        <div className={styles.CategoryListSection}>
            <div className={styles.CategoryListContainer} ref={categoryRef} >
                <div className={styles.CategoryListTitle}>
                    <h1>Categories</h1>
                    <Link href='/admin/categories/create'>
                        <div className={styles.AddProductButton}>
                            <FontAwesomeIcon icon={faPlus} />
                            <p>Add Category</p>
                        </div>
                    </Link>
                </div>
                <div className={styles.CategoryListIcon}>
                    <FontAwesomeIcon onClick={() => setShow(0)} className={styles.CategoryListIconIcon} icon={faChevronUp} />
                </div>
            </div>
            <div className={styles.CategoryListDisplaySection}>
                <table className={styles.CategoryListDisplayContainer}>
                    <thead className={styles.CategoryListDisplayTableHead}>
                        <tr className={styles.CategoryListDisplayTableHead1}>
                            <th className={styles.CategoryListDisplayTableHeadName}>Name</th>
                        </tr>
                    </thead>
                    <tbody className={styles.CategoryListDisplayTableBody}>
                        {categories.map(category => (
                            <tr key={category.id} className={styles.CategoryListDisplayTableRow}>
                                <td className={styles.CategoryImg}><img src={`${baseUrl}/storage/${category.image}`} alt={category.name} /></td>
                                <td className={styles.CategoryName}><h4>{category.name}</h4></td>
                                <td className={styles.CategoryListDisplayTableActions}>
                                    <Link 
                                        href={`/admin/categories/${category.id}/edit`} 
                                        className={styles.CategoryEdit}>
                                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                    </Link>
                                    <form onSubmit={(event) => handleDeleteClick(category, event)} style={{ display: 'inline' }}>
                                        <button type="submit" className={styles.CategoryDelete}>
                                            <FontAwesomeIcon icon={faTrashCan} /> Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    );
}

export default CategoryList;