import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { route } from 'ziggy-js';

function CreateCategory({ flash }) {
    const [name, setName] = useState('');
    const { data, setData, post, errors, reset } = useForm({
        name: '',
        description: '',
        image: null,
    });
    const [showFlash, setShowFlash] = useState(true);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('categories.store'), {
            onFinish: () => {
                if (!Object.keys(errors).length) {
                    setShowFlash(true);
                    reset();
                }
            },
            forceFormData: true,
        });
    }

    function handleClearForm() {
        setShowFlash(false);
        reset();
    }

    return (
        <Layout>
            <Head title='Create Category' />
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
                    <h2>Create New Category</h2>
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
                    </div>
                    <button type="submit" className={styles.submitButton}>Create Category</button>
                </form>
            </div>
        </Layout>
    );
}

export default CreateCategory;

