import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';

function CategoryEdit({ flash }) {
    const { category } = usePage().props;
    const { data, setData, errors, reset } = useForm({
        name: '',
        description: '',
        image: null,
    });
    const [showFlash, setShowFlash] = useState(true);

    console.log(data);
    
    useEffect(() => {
        setData({
            name: category.name || '',
            description: category.description || '',
            image: null,
        });
    }, [category]);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }

        router.post(`/admin/categories/${category.id}`, formData);
    }

    function handleClearForm() {
        setShowFlash(false);
        reset();
    }

    return (
        <Layout>
            <Head title='Edit Category' />
            <div className={styles.createDashboard}>
                {flash?.success && showFlash && (
                    <div className={styles.alertSuccess}>
                        {flash.success}
                        <button className={styles.closeButton} onClick={handleClearForm}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                )}
                <form className={styles.productForm} onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2>Edit Category</h2>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Name"
                            className={styles.formInput}
                        />
                        {errors.name && <div className={styles.error}>{errors.name}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Description"
                            className={styles.formInput}
                        />
                        {errors.description && <div className={styles.error}>{errors.description}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <input
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className={styles.formInput}
                        />
                        {errors.image && <div className={styles.error}>{errors.image}</div>}
                        {data.image && <img src={`/storage/${data.image}`} className={styles.ProductEditImageDisplay} alt={data.name} />}
                    </div>
                    <button type="submit" className={styles.submitButton}>Update Category</button>
                </form>
            </div>
        </Layout>
    );
}

export default CategoryEdit;
