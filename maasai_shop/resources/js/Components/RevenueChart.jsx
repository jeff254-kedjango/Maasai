import React from 'react';
import { Pie } from 'react-chartjs-2';
import { router } from '@inertiajs/react';
import styles from '../../css/components/ChartComponent.module.css'; // Import your CSS module


const RevenueChart = ({ productRevenue, title }) => {
    // Prepare data for Chart.js
    const data = {
        labels: productRevenue.map(product => product.name),
        datasets: [
            {
                label: 'Total Revenue',
                data: productRevenue.map(product => product.total_revenue),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Product Revenue Distribution',
            },
        },
    };

    return (
        <div className={styles.pieChartContainer}>
            <h2>{title}</h2>
            <Pie data={data} options={options} />
        </div>
    );
}; 

export default RevenueChart