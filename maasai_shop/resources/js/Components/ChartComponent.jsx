import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import styles from '../../css/components/ChartComponent.module.css'; // Import your CSS module


function ChartComponent({ title, data }) {
    useEffect(() => {
        if (data.length > 0) {
            const ctx = document.getElementById(title).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        label: title,
                        data: data.map(item => item.total_quantity || item.re_order_count || item.quantity),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [data, title]);

    return (
        <div className={styles.chartContainer}>
            <h2>{title}</h2>
            <canvas id={title} />
        </div>
    );
}

export default ChartComponent;