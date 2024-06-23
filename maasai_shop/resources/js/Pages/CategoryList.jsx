import React from 'react';
import { Link } from '@inertiajs/react';
import styles from "../../css/components/CategoryList.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function CategoryList({ setShow, categories }) {
    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';
    
    return (
        <div className={styles.CategoryListSection}>
            <div className={styles.CategoryListContainer}>
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
                                        href={`/admin/categories/${category.id}/edit `} 
                                        className={styles.CategoryEdit}>
                                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                    </Link>
                                    <Link 
                                        as="button" 
                                        method="delete" 
                                        href={`/admin/categories/${category.id}`} 
                                        className={styles.CategoryDelete} 
                                        type="button">
                                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;
