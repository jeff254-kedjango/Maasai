import React, { useState, useRef } from 'react';
import styles from '../../css/components/OrderList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';
import { formatNumber } from '@/utils/formatNumber';
import { formatDate } from '@/utils/formatDate';

function OrderList({ setShow, orders }) {
    
    const orderListSectionRef = useRef(null);
    const [inputValue, setInputValue] = useState(1);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(5);
    const [expand, setExpand] = useState(0);
    const [orderList, setOrderList] = useState(orders); // Create local state for orders

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const prod = orderList ? orderList.slice(start, end) : [];

    const pages = orderList ? Math.ceil(orderList.length / 5) : 0;

    const handlePagination = (e) => {
        setEnd(e * 5);
        setStart((e * 5) - 5);
        if (orderListSectionRef.current) {
            orderListSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleClick = () => {
        const numberValue = parseInt(inputValue, 10); // Parse the input to a number
        if (!isNaN(numberValue)) { // Check if it's a valid number
            if (numberValue <= pages && numberValue > 0) {
                setInputValue(numberValue);
                handlePagination(numberValue);
            }
        }
    };

    const handleIsSeenChange = (orderId) => {
        const updatedOrders = orderList.map(o =>
            o.id === orderId ? { ...o, is_seen: !o.is_seen } : o
        );
        setOrderList(updatedOrders);

        // Send update to backend
        router.post(route('orders.update', orderId), {
            _method: 'PUT',
            is_seen: !orderList.find(order => order.id === orderId).is_seen,
        }, {
            preserveScroll: true,
        });
    };

    const handleStatusChange = (orderId, status) => {
        const updatedOrders = orderList.map(o =>
            o.id === orderId ? { ...o, status } : o
        );
        setOrderList(updatedOrders);

        // Send update to backend
        router.post(route('orders.update', orderId), {
            _method: 'PUT',
            status,
        }, {
            preserveScroll: true,
        });
    };

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    return (
        <div className={styles.OrderListSection}>
            <div className={styles.OrderListContainer} ref={orderListSectionRef} >
                <div className={styles.OrderListTitle}>
                    <h3>Orders</h3>
                </div>
                <div className={styles.OrderListIcon}>
                    <FontAwesomeIcon onClick={() => setShow(0)} className={styles.OrderListIconIcon} icon={faChevronUp} />
                </div>
            </div>
            <div className={styles.OrderListDisplaySection}>
                <div className={styles.OrderListDisplayContainer}>
                    {orderList && prod.map((element) => (
                        <div key={element.id} className={styles.OrderListDisplayCard}>
                            <div className={styles.OrderListDisplayCardDetails}>
                                <div className={styles.OrderListDisplayCardName}>
                                    <h3> {element.user.name} </h3>
                                    <small>{element.user.email}</small>
                                    <small>{element.user.phone_number}</small>
                                </div>
                                <div className={styles.OrderListDisplayCardTotal}>
                                    <h3>Total: <span> {formatNumber(element.total)} </span></h3>
                                </div>
                                <div className={styles.OrderListDisplayCardDate}>
                                    <p>Date: <span> {formatDate(element.created_at)} </span></p>
                                </div>
                                <div className={styles.OrderListDisplayCardSeen}>
                                    <small>is seen:
                                        <input
                                            type="checkbox"
                                            checked={element.is_seen}
                                            onChange={() => handleIsSeenChange(element.id)}
                                        />
                                    </small>
                                </div>
                                <div className={styles.OrderListDisplayCardDelivery}>
                                    <select
                                        value={element.status}
                                        onChange={(e) => handleStatusChange(element.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                                {expand === element.id ?
                                    <div onClick={() => setExpand(0)} className={styles.OrderListDisplayCardIcon}>
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </div>
                                    :
                                    <div onClick={() => setExpand(element.id)} className={styles.OrderListDisplayCardIcon}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </div>
                                }
                            </div>
                            {expand === element.id &&
                                <div className={styles.OrderListProductsDisplayContainer}>
                                    {element.products.map((el) => (
                                        <div key={el.id} className={styles.OrderListProductsDisplayCard}>
                                            <div className={styles.OrderListProductsDisplayCardImage}>
                                                <img src={`${baseUrl}/storage/${el.image1}`} alt={el.name} />
                                            </div>
                                            <div className={styles.OrderListProductsDisplayCardDetails}>
                                                <div className={styles.OrderListProductsDisplayCardDetailsTitle}>
                                                    <small>{el.name}</small>
                                                </div>
                                                <div className={styles.OrderListProductsDisplayCardDetailsSpecs}>
                                                    <small>Quantity: <span>{el.pivot.quantity}</span></small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}
                    {prod.length === 0 &&
                        <div className={styles.NoOrderListDisplayCard}>
                            <p>Nothing to Display. Refresh Page if it's a network error.</p>
                        </div>
                    }
                </div>
                {prod.length > 0 &&
                    <div className={styles.ProductListDisplayPagination}>
                        <div className={styles.PaginationContainer}>
                            <button onClick={handleClick}>Submit</button>
                            <input
                                type="number"
                                value={inputValue >= 1 && inputValue <= pages && inputValue}
                                onChange={handleInputChange}
                                placeholder="Page"
                            />
                        </div>
                        <p>Page {inputValue} / {pages} </p>
                    </div>
                }
            </div>
        </div>
    );
}

export default OrderList;