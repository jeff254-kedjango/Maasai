import React from 'react';

const ShowOrder = ({ order }) => {
    return (
        <div>
            <h1>Order Details</h1>
            <p>ID: {order.id}</p>
            <p>User ID: {order.user_id}</p>
            <p>Total: {order.total}</p>
            <p>Status: {order.status}</p>
            <h3>Products</h3>
            <ul>
                {order.products.map((product) => (
                    <li key={product.id}>
                        {product.name} - Quantity: {product.pivot.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowOrder;