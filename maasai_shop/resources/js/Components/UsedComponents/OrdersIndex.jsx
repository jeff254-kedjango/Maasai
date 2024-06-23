import React from 'react';
import { Link } from '@inertiajs/react';

const OrdersIndex = ({ orders }) => {
    return (
        <div>
            <h1>Orders</h1>
            <Link href={route('orders.create')}>Create Order</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>{order.total}</td>
                            <td>{order.status}</td>
                            <td>
                                <Link href={route('orders.show', order.id)}>View</Link>
                                <Link href={route('orders.edit', order.id)}>Edit</Link>
                                <Link as="button" href={route('orders.destroy', order.id)} method="delete">Delete</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersIndex;