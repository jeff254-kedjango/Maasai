import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styles from '../../css/Charts.module.css';

const Analytics = ({ dates, newUsers, returningUsers }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = document.getElementById('myChart').getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy(); // Destroy the previous chart instance
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates || [], // Default to empty array if dates is undefined
                datasets: [
                    {
                        label: 'New Users',
                        data: newUsers || [], // Default to empty array if newUsers is undefined
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Returning Users',
                        data: returningUsers || [], // Default to empty array if returningUsers is undefined
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allows canvas to stretch to the container
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'New vs Returning Users Over Time',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Users',
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy(); // Cleanup chart instance on component unmount
            }
        };
    }, [dates, newUsers, returningUsers]);

    return (
        <div className={styles.chartContainer}>
            <h1>Total Visits per Day</h1>
            <canvas id="myChart"></canvas>
        </div>
    );
};

export default Analytics;