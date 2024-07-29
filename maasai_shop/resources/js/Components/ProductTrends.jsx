import React, { useState } from 'react';
import ChartComponent from './ChartComponent';
import RevenueChart from './RevenueChart';
import styles from '../../css/ProductTrends.module.css'; // Import your CSS module
import TrendingProducts from './TrendingProducts';

function ProductTrends({ trendingProducts = [], productRevenue = [], mostSoldProducts = [], reOrderedProducts = [], stockCheckData = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginate = (items) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    return (
        <div className={styles.container}>
            <h1>Product Trends</h1>
            <TrendingProducts trendingProducts={trendingProducts} />
            <ChartComponent title="Most Sold Products" data={paginate(mostSoldProducts)} />
            <ChartComponent title="Most Re-Ordered Products" data={paginate(reOrderedProducts)} />
            <ChartComponent title="Stock Check" data={paginate(stockCheckData)} />
            <RevenueChart title="Total Revenue Contribution Chart per Product" productRevenue={productRevenue} />
        </div>
    );
}

export default ProductTrends;