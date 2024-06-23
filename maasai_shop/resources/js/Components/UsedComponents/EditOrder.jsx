import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const EditOrder = ({ order, products }) => {
    const [formData, setFormData] = useState({
        total: order.total,
        products: order.products.map(p => ({ id: p.id, quantity: p.pivot.quantity })),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [field]: value,
        };
        setFormData({ ...formData, products: newProducts });
    };

    const addProduct = () => {
        setFormData({ ...formData, products: [...formData.products, { id: '', quantity: '' }] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('orders.update', order.id), formData);
    };

    return (
        <div>
            <h1>Edit Order</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Total:</label>
                    <input type="text" name="total" value={formData.total} onChange={handleChange} />
                </div>
                <div>
                    <h3>Products</h3>
                    {formData.products.map((product, index) => (
                        <div key={index}>
                            <select
                                name={`products[${index}].id`}
                                value={product.id}
                                onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                            >
                                <option value="">Select a product</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name={`products[${index}].quantity`}
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addProduct}>
                        Add Product
                    </button>
                </div>
                <button type="submit">Update Order</button>
            </form>
        </div>
    );
};

export default EditOrder;