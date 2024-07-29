import React, { useState } from 'react';
import { Link, usePage, router,  Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { useCart } from './CartContext';
import styles from '../../css/Checkout.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faXmark, faPlus, faMinus, faTrashCan,faCreditCard, faMoneyBill1, faMobile } from '@fortawesome/free-solid-svg-icons'; 

function CheckOut({ title, error, success }) {

  const [ next, setNext ] = useState(1);
  const { cart, total, clearCart } = useCart();
  const { auth } = usePage().props;

  const handleOrder = () => {
    router.post('/orders', {
        user_id: auth.user.id,
        total,
        products: cart.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
        })),
    }, {
        onSuccess: () => {
          clearCart();// Clear the cart after the order is placed
          console.log('Order placed successfully');
        },
        onError: (error) => {
          console.error('Error creating order:', error);
        }
    });
  };  


  const handlePayment = () => {
    router.post('/pesapal/initiate-payment', {
      amount: total,
      first_name: auth.user.first_name,
      last_name: auth.user.last_name,
      email: auth.user.email,
      phone_number: auth.user.phone_number,
    }, {
      onSuccess: (page) => {
        if (page.props.payment_url) {
          window.location.href = page.props.payment_url;
        }
      },
      onError: (error) => {
        console.error('Error initiating payment:', error);
      }
    });
  };


    function formatNumber(number) {
      return new Intl.NumberFormat().format(number);
    }


  return (
    <Layout auth={auth}>
      <Head title="Check Out" />
      <div className={ styles.CheckOutSection }>
        <div className={ styles.CheckOutContainer }>
          <div className={ styles.CheckOutContainerTitle }>
            <div className={ styles.CheckOutConfirm } onClick={()=>setNext(1)}>
              <h4>Confirm Order</h4>
            </div>
            <div className={ styles.CheckOutOrder } onClick={()=>{ success && setNext(2)} }>
              <h4>Payment</h4>
            </div>
          </div>
          { next == 1 && 
            <div className={styles.CheckOutCard}>
              { success ? 
                <div className={styles.YesPop}>
                  <p>{success && success}!!</p>
                  <button onClick={()=> { success && setNext(2)}}>
                    Proceed to Payment
                  </button>
                </div>
                :
                <>
                  <div className={styles.CheckOutTotal}>
                    <h3>TOTAL</h3>
                    <p><span>KES:</span>{formatNumber(total)}</p>
                  </div>
                  <button className={styles.SubmitOrderBtn} onClick={()=>handleOrder()}>
                    Submit Order
                  </button>              
                </>
            }
            </div> 
          }
          {
            next == 2 && 
            <div className={styles.CheckOutCard} >
              <div className={styles.CheckOutTitle}>
                <h3>Choose Preffered Your Payment Method</h3>
              </div>
              <div className={styles.CheckOutDetails}>
                <div className={styles.CheckOutDetailsCard}>
                  <div className={styles.CashOnDeliveryIcon} >
                    <FontAwesomeIcon icon={faMoneyBill1} />
                  </div>
                  <div className={styles.CashOnDeliveryWords}>
                    <h3>Cash on Delivery</h3>
                  </div>
                </div> 
                <div className={styles.CheckOutDetailsCard}>
                  <div className={styles.CashOnDeliveryIcon} >
                    <FontAwesomeIcon icon={faMobile} />
                  </div>
                  <div className={styles.CashOnDeliveryWords}>
                    <h3>M-PESA</h3>
                  </div>
                </div>
                <div className={styles.CheckOutDetailsCard} onClick={handlePayment} >
                  <div className={styles.CashOnDeliveryIcon} >
                    <FontAwesomeIcon icon={ faCreditCard } />
                  </div>
                  <div className={styles.CashOnDeliveryWords}>
                    <h3>Bank </h3>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </Layout>
  )
}

export default CheckOut;