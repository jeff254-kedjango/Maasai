import React, { useState } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import styles from '../../css/ContactForm.module.css';

export default function ContactForm() {
  const { data, setData, post, errors } = useForm({
    name: '',
    email: '',
    message: '',
    subscribeEmail: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setData('name', '');
        setData('email', '');
        setData('message', '');
      }
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    post(route('subscribe.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setData('subscribeEmail', '');
      }
    });
  };

  return (
    <div className={styles.Container}>
      <Head title="Contact" />
      <form className={styles.Form} onSubmit={handleSubmit}>
        <h2>Contact Form</h2>
        <div className={styles.FormGroup}>
          <label>Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
          />
          {errors.name && <div>{errors.name}</div>}
        </div>
        <div className={styles.FormGroup}>
          <label>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
          />
          {errors.email && <div>{errors.email}</div>}
        </div>
        <div className={styles.FormGroup}>
          <label>Message</label>
          <textarea
            value={data.message}
            onChange={e => setData('message', e.target.value)}
          />
          {errors.message && <div>{errors.message}</div>}
        </div>
        <button className={styles.ContactFormBtn}   type="submit">Submit</button>
      </form>
      <form className={styles.SubscribeForm} onSubmit={handleSubscribe}>
        <div className={styles.FormGroup}>
          <label>Subscribe to our newsletter and get regular updates on Promotions and New Stock arrivals.</label>
          <input
            type="email"
            value={data.subscribeEmail}
            placeholder='Enter your Email'
            onChange={e => setData('subscribeEmail', e.target.value)}
          />
          {errors.subscribeEmail && <div>{errors.subscribeEmail}</div>}
        </div>
        <button type="submit" className={styles.ContactFormBtn}  >Subscribe</button>
      </form>
    </div>
  );
}