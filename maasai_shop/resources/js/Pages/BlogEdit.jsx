import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateBlog.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';

function BlogEdit({ flash }) {
    const { blog, auth } = usePage().props;

    const { data, setData, post, errors, reset } = useForm({
        title: '',
        category: '',
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

    useEffect(() => {
        setData({
            title: blog.title || '',
            category: blog.category || '',
            image: null,
            paragraph1: blog.paragraph1 || '',
            paragraph2: blog.paragraph2 || '',
            paragraph3: blog.paragraph3 || '',
            paragraph4: blog.paragraph4 || '',
            paragraph5: blog.paragraph5 || '',
            paragraph6: blog.paragraph6 || '',
            paragraph7: blog.paragraph7 || '',
            paragraph8: blog.paragraph8 || '',
            paragraph9: blog.paragraph9 || '',
            paragraph10: blog.paragraph10 || ''
        });
    }, [blog]);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('title', data.title);
        formData.append('category', data.category);

        for (let i = 1; i <= 10; i++) {
            formData.append(`paragraph${i}`, data[`paragraph${i}`]);
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        router.post(`/admin/blogs/${blog.slug}`, formData, {
            onFinish: () => {
                handleFormFinish();
            }
        });
    }

    function handleClearForm() {
        setShowFlash(false);
        reset();
    }

    function handleFormFinish() {
        reset();
        if (flash?.success) {
            alert(flash.success);
        } else if (flash?.error) {
            alert(flash.error);
        }

        if (flash?.success) {
            router.visit('/dashboard');
        }
    }

    return (
        <Layout>
            <Head title='Edit Blog' />
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
                    <h2>Edit Blog</h2>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                    <input type="hidden" name="_method" value="PUT" />

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Title</small>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            placeholder="Title"
                            className={styles.formInput}
                        />
                        {errors.title && <div className={styles.error}>{errors.title}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Category</small>
                        <input
                            type="text"
                            value={data.category}
                            onChange={e => setData({ ...data, category: e.target.value })}
                            placeholder="Category"
                            className={styles.formInput}
                        />
                        {errors.category && <div className={styles.error}>{errors.category}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Image</small>
                        <input
                            type="file"
                            onChange={e => setData({ ...data, image: e.target.files[0] })}
                            className={styles.formInput}
                        />
                        {errors.image && <div className={styles.error}>{errors.image}</div>}
                        {blog.image && <img src={`/storage/${blog.image}`} className={styles.blogImageDisplay} alt="Blog Image" />}
                    </div>

                    {[...Array(10).keys()].map(i => (
                        <div key={i} className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <small>Paragraph {i + 1}</small>
                            <textarea
                                value={data[`paragraph${i + 1}`]}
                                onChange={e => setData({ ...data, [`paragraph${i + 1}`]: e.target.value })}
                                placeholder={`Paragraph ${i + 1}`}
                                className={styles.formInput}
                            />
                            {errors[`paragraph${i + 1}`] && <div className={styles.error}>{errors[`paragraph${i + 1}`]}</div>}
                        </div>
                    ))}

                    <button type="submit" className={styles.submitButton}>Update Blog</button>
                </form>
            </div>
        </Layout>
    );
}

export default BlogEdit;