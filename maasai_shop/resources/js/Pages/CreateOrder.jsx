import React, { useState } from 'react';
import { router } from '@inertiajs/react'

const CreateOrder = ({ products }) => {
    const [formData, setFormData] = useState({
        user_id: '',
        total: '',
        products: [],
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
        router.post(route('orders.store'), formData);
    };

    return (
        <div>
            <h1>Create Order</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID:</label>
                    <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} />
                </div>
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
                <button type="submit">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;