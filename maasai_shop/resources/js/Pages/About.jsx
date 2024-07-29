import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import styles from "../../css/About.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faTruckFast , faCertificate } from '@fortawesome/free-solid-svg-icons';

export default function About({title, auth }) {
  return (
    <Layout auth={auth} >
      <Head title="About" />
      <div className={styles.AboutSection}>
        <h1>About <span>Us</span></h1>
        <div className={styles.AboutMessage}>
          <p>Making Parenting in Nairobi Easier! Our Baby Shop offers top-notch products, speedy delivery, and a no-fuss return policy. Quality control is our promise, and we stand by our products. If anything arrives damaged, we've got you covered. Shop now and let us support your parenting journey!</p>
          <h4> - Zoe Kariuki <span>( C.E.O. Zoe's Kids Baby Shop )</span></h4>
        </div>
        <div className={styles.QualityAssurance}>
          <div className={styles.QualityAssuranceTitle}>
            <h3>Quality Assurance</h3>
          </div>
          <div className={styles.QualityAssuranceContainer}>
            <div className={styles.AboutUsIcon}>
             <FontAwesomeIcon icon={faCertificate} />
            </div>
            <div className={styles.AboutUsDetails}>
              <p>The products we offer are top notch brands that have been highly rated by other Users localy and globally.</p>
              <p>Most of our Products have warranty attached to them, plus quality license assurance certification</p>
            </div>
          </div>
        </div>

        <div className={styles.DeliveryInfo}>
          <div className={styles.DeliveryInfoTitle}>
            <h3>Delivery Details</h3>
          </div>
          <div className={styles.DeliveryInfoContainer}>
            <div className={styles.AboutUsDetails}>
            <p>Our delivery plan is FREE for goods above <span>Kes 1,000/=</span> within Nairobi & Thika</p>
            <p>We assure our clients  within Kenya of a 24Hrs delivery time from the time of purchase.</p>
            </div>
            <div className={styles.AboutUsIcon}>
              <FontAwesomeIcon icon={faTruckFast} />
            </div>
          </div>
        </div>

        <div className={styles.ReturnPolicy}>
          <div className={styles.QualityAssuranceTitle}>
            <h3>Return Policy</h3>
          </div>
          <div className={styles.QualityAssuranceContainer}>
            <div className={styles.AboutUsIcon}>
             <FontAwesomeIcon icon={faCartArrowDown} />
            </div>
            <div className={styles.AboutUsDetails}>
            <p>For damaged goods during delivery or transit, we offer Replacement.</p>
            <p>Contact our Customer Care numbers or fill a form for replacement purposes. </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}