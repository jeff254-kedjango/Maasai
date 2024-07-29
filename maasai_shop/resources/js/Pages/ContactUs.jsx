import React from 'react';
import Layout from '../Layouts/Layout';
import { Link, Head } from '@inertiajs/react';
import styles from "../../css/ContactUs.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import whatsUp from '../../images/whatsUp.png';
import ContactForm from './ContactForm';

function ContactUs({title, auth}) {
  return (
    <Layout auth={auth} >
      <Head title="Contact Us" />
      <div className={styles.ContactUsContainer}>
        <div className={styles.ContactUsDetails}>
          <h2>We are here for you,</h2>
          <h4>Fast response.</h4>
          <p>You can track your deliveries on WhatsApp or call Customer Care numbers for quick response.</p>
        </div>
        <div className={styles.ContactUsActionsContainer}>
          <div className={styles.ContactUsActions}>
            <div className={styles.ActionImg}>
              <img src={whatsUp} alt="Zoe's Kids BabyShop WhatsApp" />
            </div>
            <div className={styles.ActionDetails}>
              <p>( +254 )783-469-713</p>
            </div>
          </div>
          <div className={styles.ContactUsActions}>
            <div className={styles.ActionImg}>
              <FontAwesomeIcon icon={faAt} />
            </div>
            <div className={styles.ActionDetails}>
              <p>info@zoeskidsbabyshop.co.ke</p>
            </div>
          </div>
          <div className={styles.ContactUsActions}>
            <div className={styles.ActionImg}>
             <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div className={styles.ActionDetails}>
              <p>Nairobi/Kenya</p>
            </div>
          </div>
        </div>
        < ContactForm />
      </div>
    </Layout>
  )
}

export default ContactUs;