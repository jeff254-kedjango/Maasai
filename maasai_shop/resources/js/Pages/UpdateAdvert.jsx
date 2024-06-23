import React, { useEffect, useState } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';

const UpdateAdvert = () => {
    const { advert } = usePage().props;
    const { data, setData, put, errors } = useForm({
        title: advert.title || '',
        content: advert.content || '',
        video: null,
        image: null,
        start_date: advert.start_date || '',
        end_date: advert.end_date || '',
    });

    console.log(data)

    useEffect(() => {
        setData({
            title: advert.title || '',
            content: advert.content || '',
            video: null,
            image: null,
            start_date: advert.start_date || '',
            end_date: advert.end_date || '',
        });
    }, [advert]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        put(route('admin.adverts.update', { id: advert.id }), formData);
    };

    return (
        <Layout>
            <Head title='Edit Advert'/>
            <div className={styles.createDashboard}>
                <form className={styles.productForm} onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1>Update Advert</h1>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>title: </small>
                        <input className={styles.formInput} type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title" />
                        {errors.title && <div>{errors.title}</div>}
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>description: </small>
                        <textarea className={styles.formInput} value={data.content} onChange={e => setData('content', e.target.value)} placeholder="Content" />
                        {errors.content && <div>{errors.content}</div>}
                    </div>
                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>picture: </small>
                        <input className={styles.formInput} type="file" onChange={e => setData('image', e.target.files[0])} />
                        {errors.image && <div>{errors.image}</div>}
                        {data.image && <img src={`/storage/${data.image}`} className={styles.ProductEditImageDisplay} alt={data.title} />}
                    </div>
                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>video: </small>
                        <input className={styles.formInput} type="file" onChange={e => setData('video', e.target.files[0])} />
                        {errors.video && <div>{errors.video}</div>}
                        {data.video && <video src={`/storage/${data.video}`} controls />}
                    </div>
                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>start date: </small>
                        <input className={styles.formInput} type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                        {errors.start_date && <div>{errors.start_date}</div>}
                    </div>
                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>end date: </small>
                        <input className={styles.formInput} type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                        {errors.end_date && <div>{errors.end_date}</div>}
                    </div>
                    <button  className={styles.submitButton} type="submit">Update</button>
                </form>
            </div>
        </Layout>
    );
};

export default UpdateAdvert;
