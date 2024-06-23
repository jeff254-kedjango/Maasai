import React from 'react';
import { usePage } from '@inertiajs/react';


function CategoryCard() {
    
    const { category } = usePage().props;

    return (
        <div>
            <h1>{category.name}</h1>
            <p>Created at: {category.created_at}</p>
            <p>Updated at: {category.updated_at}</p>
        </div>
    );
}

export default CategoryCard