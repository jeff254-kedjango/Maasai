import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from '../../css/CreateProduct.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function CreateProducts({ auth, categories, flash }) {
  const { data, setData, post, errors, reset } = useForm({
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
  });

  const [showFlash, setShowFlash] = useState(true);

  function handleSubmit(e) {
      e.preventDefault();
      post(route('admin.create-product'), {
          onFinish: () => {
              if (!Object.keys(errors).length) {
                  setShowFlash(true);
                  reset();
              }
          },
          forceFormData: true,
      });
  }

  // console.log(data)

  const handleClearForm = () => {
    reset();
    setShowFlash(false);
  };

  return (
    <Layout auth={auth}>
      <Head title="Create Products" />
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
            <h2>Create New Product</h2>
          <input type="hidden" name="_token" value="{{ csrf_token() }}" />

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <small>Name</small>
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
            <small>Description</small>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              placeholder="Description"
              className={styles.formInput}
            />
            {errors.description && <div className={styles.error}>{errors.description}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Sale Price</small>
            <input
              type="number"
              value={data.price}
              onChange={e => setData('price', e.target.value)}
              placeholder="Price"
              className={styles.formInput}
            />
            {errors.price && <div className={styles.error}>{errors.price}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Marked Price</small>
            <input
              type="number"
              value={data.sale_price}
              onChange={e => setData('sale_price', e.target.value)}
              placeholder="Sale Price"
              className={styles.formInput}
            />
            {errors.sale_price && <div className={styles.error}>{errors.sale_price}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Stock Quantity</small>
            <input
              type="number"
              value={data.quantity}
              onChange={e => setData('quantity', e.target.value)}
              placeholder="Quantity"
              className={styles.formInput}
            />
            {errors.quantity && <div className={styles.error}>{errors.quantity}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Category</small>
            <select
              value={data.category_id}
              onChange={e => setData('category_id', e.target.value)}
              className={styles.formInput}
            >
              <option value="" disabled>Select a category</option>
              {categories && categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <div className={styles.error}>{errors.category_id}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Front Image</small>
            <input
              type="file"
              onChange={e => setData('image1', e.target.files[0])}
              className={styles.formInput}
            />
            {errors.image1 && <div className={styles.error}>{errors.image1}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Side Image</small>
            <input
              type="file"
              onChange={e => setData('image2', e.target.files[0])}
              className={styles.formInput}
            />
            {errors.image2 && <div className={styles.error}>{errors.image2}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>Aletrnative Image</small>
            <input
              type="file"
              onChange={e => setData('image3', e.target.files[0])}
              className={styles.formInput}
            />
            {errors.image3 && <div className={styles.error}>{errors.image3}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.halfWidth}`}>
            <small>2nd Alternative Image</small>
            <input
              type="file"
              onChange={e => setData('image4', e.target.files[0])}
              className={styles.formInput}
            />
            {errors.image4 && <div className={styles.error}>{errors.image4}</div>}
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <small>Video</small>
            <input
                type="file"
                onChange={e => setData({ ...data, video: e.target.files[0] })}
                className={styles.formInput}
            />
            {errors.video && <div className={styles.error}>{errors.video}</div>}
          </div>

          <button type="submit" className={styles.submitButton}>Create Product</button>
        </form>
      </div>
    </Layout>
  );
}

export default CreateProducts;