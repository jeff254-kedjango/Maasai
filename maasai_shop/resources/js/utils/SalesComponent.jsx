import React, { useState } from 'react';
import { formatNumber } from '@/utils/formatNumber'; // Assuming you have a utility function for formatting numbers
import ErrorBoundary from './ErrorBoundary';
import styles from '../../css/components/SalesComponent.module.css';

const calculateTotalSales = (orders) => {
    try {
        return orders.reduce((total, order) => {
            return total + parseFloat(order.total);
        }, 0);
    } catch (error) {
        console.error('Error calculating total sales:', error);
        return 0;
    }
};

const isWithinRange = (date, startDate, endDate) => {
    const d = new Date(date);
    return d >= startDate && d <= endDate;
};

const filterSalesByDateRange = (orders, start, end) => {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    return orders.filter(order => isWithinRange(order.created_at, startDate, endDate));
};

const SalesComponent = ({ orders }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const filteredOrders = filterSalesByDateRange(orders, startDate, endDate);
    const totalSales = calculateTotalSales(filteredOrders);

    return (
        <ErrorBoundary>
            <div className={styles.SalesComponentContainer}>
                <h1>Sales Report:</h1>
                <div className={styles.SalesComponentDate}>
                    <label>
                        Sales from:
                        <input type="date" className={styles.filterInput} value={startDate} onChange={handleStartDateChange} />
                    </label>
                    <label>
                        to:
                        <input type="date" className={styles.filterInput} value={endDate} onChange={handleEndDateChange} />
                    </label>
                </div>
                <div className={styles.TotalSalesContainer} >
                    <h2>Total Sales: {formatNumber(totalSales)}</h2>
                </div>
                <div className={styles.FilteredOrdersContainer}>
                    <h2>Filtered Orders</h2>
                    <ul className={styles.ListCardContainer}>
                        {filteredOrders.map(order => (
                            <li key={order.id} className={styles.ListCard}>
                                <h3>{order.user.name}</h3> <p>KES {formatNumber(order.total)}</p> <small>{order.status}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default SalesComponent;