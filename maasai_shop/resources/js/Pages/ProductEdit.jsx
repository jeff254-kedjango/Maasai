import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function ProductEdit({ flash }) {
    const { product, categories, auth } = usePage().props;

    const { data, setData, put, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        sale_price: '',
        category_id: '',
        quantity: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        video: null,
    });

    const [showFlash, setShowFlash] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            sale_price: product.sale_price || '',
            category_id: product.category_id || '',
            quantity: product.quantity || '',
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            video: null,
        });
    }, [product]);

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData();
        formData.append('_method', 'put');
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price);
        if (data.sale_price) formData.append('sale_price', data.sale_price);
        if (data.category_id) formData.append('category_id', data.category_id);
        if (data.quantity) formData.append('quantity', data.quantity);
    
        ['image1', 'image2', 'image3', 'image4', 'video'].forEach(field => {
            if (data[field]) {
                formData.append(field, data[field]);
            }
        });
    
        put(route(`admin.update-product`, { product: product.id }), {
            data: formData,
            onFinish: () => {
                setLoading(false);
            },
            onError: (errors) => {
                console.log('Form submission error:', errors);
                setLoading(false);
            },
        });
    }

    function handleClearForm() {
        setShowFlash(false);
        reset();
    }

    return (
        <Layout>
            <Head title='Edit Product' />
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
                    <h2>Edit Product</h2>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Name</small>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData({ ...data, name: e.target.value })}
                            placeholder="Name"
                            className={styles.formInput}
                        />
                        {errors.name && <div className={styles.ErrorText}>{errors.name}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Description</small>
                        <textarea
                            value={data.description}
                            onChange={e => setData({ ...data, description: e.target.value })}
                            placeholder="Description"
                            className={styles.formInput}
                        />
                        {errors.description && <div className={styles.ErrorText}>{errors.description}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Price</small>
                        <input
                            type="number"
                            value={data.price}
                            onChange={e => setData({ ...data, price: e.target.value })}
                            placeholder="Price"
                            className={styles.formInput}
                        />
                        {errors.price && <div className={styles.ErrorText}>{errors.price}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Discount Price ( * Fill ONLY if product is on discount )</small>
                        <input
                            type="number"
                            value={data.sale_price}
                            onChange={e => setData({ ...data, sale_price: e.target.value })}
                            placeholder="Sale Price"
                            className={styles.formInput}
                        />
                        {errors.sale_price && <div className={styles.ErrorText}>{errors.sale_price}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Stock Quantity ( * Stock quantity are visible to clients for informed shopping )</small>
                        <input
                            type="number"
                            value={data.quantity}
                            onChange={e => setData({ ...data, quantity: e.target.value })}
                            placeholder="Quantity"
                            className={styles.formInput}
                        />
                        {errors.quantity && <div className={styles.ErrorText}>{errors.quantity}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Category</small>
                        <select
                            value={data.category_id}
                            onChange={e => setData({ ...data, category_id: e.target.value })}
                            className={styles.formInput}
                        >
                            <option value="" disabled>Select a category</option>
                            {categories && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <div className={styles.ErrorText}>{errors.category_id}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Front Image</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, image1: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.image1 && <div className={styles.ErrorText}>{errors.image1}</div>}
                        {product.image1 && <img src={`/storage/${product.image1}`} className={styles.ProductEditImageDisplay} alt="Front Image" />}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Second Image</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, image2: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.image2 && <div className={styles.ErrorText}>{errors.image2}</div>}
                        {product.image2 && <img src={`/storage/${product.image2}`} className={styles.ProductEditImageDisplay} alt="Second Image" />}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Third Image</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, image3: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.image3 && <div className={styles.ErrorText}>{errors.image3}</div>}
                        {product.image3 && <img src={`/storage/${product.image3}`} className={styles.ProductEditImageDisplay} alt="Third Image" />}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Fourth Image</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, image4: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.image4 && <div className={styles.ErrorText}>{errors.image4}</div>}
                        {product.image4 && <img src={`/storage/${product.image4}`} className={styles.ProductEditImageDisplay} alt="Fourth Image" />}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Video</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, video: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.video && <div className={styles.ErrorText}>{errors.video}</div>}
                        {product.video && <video src={`/storage/${product.video}`} controls />}
                    </div>

                    <button type="submit" className={`${styles.submitButton} ${loading ? styles.loadingButton : ''}`} disabled={loading} >
                        {loading ? "Editing Product..." : 'Edit Product'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default ProductEdit;