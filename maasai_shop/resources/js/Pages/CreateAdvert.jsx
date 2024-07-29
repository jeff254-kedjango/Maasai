import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';
import ButtonAnimation from '@/Components/Lotie/LoaderAnimation'; // Renamed import to ButtonAnimation

const CreateAdvert = () => {
    const { data, setData, post, errors, reset } = useForm({
        title: '',
        content: '',
        video: null,
        image: null,
        start_date: '',
        end_date: '',
    });

    const [loading, setLoading] = useState(false);

    const handleClearForm = () => {
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log('Form submission started');
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        post(route('admin.adverts.store'), {
            data: formData,
            onFinish: () => {
                // console.log('Form submission finished');
                setLoading(false);
            },
            onError: (errors) => {
                // console.log('Form submission error:', errors);
                setLoading(false);
            }
        });
    };

    return (
        <Layout>
            <Head title='Create Advert' />
            <div className={styles.createDashboard}>
                <form className={styles.productForm} onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1>Create Advert</h1>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                    
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Title</small>
                        <input
                            className={styles.formInput}
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Title"
                        />
                        {errors.title && <div className={styles.ErrorText}>{errors.title}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <small>Description</small>
                        <textarea
                            className={styles.formInput}
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Content"
                        />
                        {errors.content && <div className={styles.ErrorText}>{errors.content}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Image</small>
                        <input
                            className={styles.formInput}
                            type="file"
                            onChange={e => setData('image', e.target.files[0])}
                        />
                        {errors.image && <div className={styles.ErrorText}>{errors.image}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Video</small>
                        <input
                            className={styles.formInput}
                            type="file"
                            onChange={e => setData('video', e.target.files[0])}
                        />
                        {errors.video && <div className={styles.ErrorText}>{errors.video}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>Start Date</small>
                        <input
                            className={styles.formInput}
                            type="date"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                        />
                        {errors.start_date && <div className={styles.ErrorText}>{errors.start_date}</div>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                        <small>End Date</small>
                        <input
                            className={styles.formInput}
                            type="date"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                        />
                        {errors.end_date && <div className={styles.ErrorText}>{errors.end_date}</div>}
                    </div>

                    <button className={`${styles.submitButton} ${loading ? styles.loadingButton : ''}`} type="submit" disabled={loading}>
                        {loading ? "Submiting Advert..." : 'Create Advert'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CreateAdvert;