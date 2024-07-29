import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement, LineController, BarController } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from '../../css/TrendingProducts.module.css'; // Import your CSS module

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement, LineController, BarController);

const TrendingProducts = ({ trendingProducts }) => {
    // Prepare the data for the Stacked Bar Line Chart
    const labels = trendingProducts.map(product => product.name);
    const trendScores = trendingProducts.map(product => product.trend_score);
    const reOrderCounts = trendingProducts.map(product => product.re_order_count);

    const data = {
        labels: labels,
        datasets: [
            {
                type: 'line',
                label: 'Trend Scores',
                data: trendScores,
                borderColor: '#36A2EB',
                borderWidth: 2,
                fill: false,
                yAxisID: 'y1'
            },
            {
                type: 'bar',
                label: 'Re-order Counts',
                data: reOrderCounts,
                backgroundColor: '#FF6384',
                yAxisID: 'y2'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Trending Products'
            }
        },
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                stacked: false,
                title: {
                    display: true,
                    text: 'Trend Scores'
                }
            },
            y2: {
                type: 'linear',
                position: 'right',
                stacked: true,
                title: {
                    display: true,
                    text: 'Re-order Counts'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1>Trending Products</h1>
            <Bar data={data} options={options} />
        </div>
    );
};

export default TrendingProducts;