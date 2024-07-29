import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateBlog.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function BlogCreate({ flash }) {
    const { categories, auth } = usePage().props;
    const { data, setData, post, errors, reset } = useForm({
        title: '',
        category_id: '',
        image: null,
        paragraph1: '',
        paragraph2: '',
        paragraph3: '',
        paragraph4: '',
        paragraph5: '',
        paragraph6: '',
        paragraph7: '',
        paragraph8: '',
        paragraph9: '',
        paragraph10: ''
    });

    const [showFlash, setShowFlash] = useState(true);

    function handleSubmit(e) {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category_id', data.category_id);
    
        for (let i = 1; i <= 10; i++) {
            formData.append(`paragraph${i}`, data[`paragraph${i}`]);
        }
    
        if (data.image) {
            formData.append('image', data.image);
        }
    
        // Log the formData to see if it's being populated correctly
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        router.post('/admin/blogs', formData, {
            onFinish: handleFormFinish
        });
    }

    function handleClearForm() {
        setShowFlash(false);
        reset();
    }

    function handleFormFinish() {
        if (flash?.success) {
            alert(flash.success);
            router.visit('/dashboard');
        } else if (flash?.error) {
            alert(flash.error);
        }
    }

    return (
        <Layout>
            <Head title="Create Blog" />
            <div className={styles.createDashboard}>
                {flash?.success && showFlash && (
                    <div className={styles.alertSuccess}>
                        {flash.success}
                        <button className={styles.closeButton} onClick={handleClearForm}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                )}
                <form className={styles.blogForm} onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2>Create Blog</h2>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Title</small>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Title"
                            className={styles.formInput}
                        />
                        {errors.title && <div className={styles.error}>{errors.title}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Category</small>
                        <select
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            className={styles.formInput}
                        >
                            <option value="">Select a category</option>
                            { categories && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <div className={styles.error}>{errors.category_id}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Image</small>
                        <input
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                            className={styles.formInput}
                        />
                        {errors.image && <div className={styles.error}>{errors.image}</div>}
                    </div>

                    {[...Array(10)].map((_, i) => (
                        <div key={i} className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <small>Paragraph {i + 1}</small>
                            <textarea
                                value={data[`paragraph${i + 1}`]}
                                onChange={e => setData(`paragraph${i + 1}`, e.target.value)}
                                placeholder={`Paragraph ${i + 1}`}
                                className={styles.formInput}
                            />
                            {errors[`paragraph${i + 1}`] && <div className={styles.error}>{errors[`paragraph${i + 1}`]}</div>}
                        </div>
                    ))}
                    
                    <button type="submit" className={styles.submitButton}>Create Blog</button>
                </form>
            </div>
        </Layout>
    );
}

export default BlogCreate;