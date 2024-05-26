'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [supermarketId, setSupermarketId] = useState('');

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRODUCT_BASE_URL}/supermarket/${supermarketId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h5 className="text-4xl font-bold mb-6 text-black">Enter Supermarket ID</h5>
                    <div className="flex items-center border-2 border-gray-300 rounded-md">
                        <input 
                            type="text" 
                            value={supermarketId} 
                            onChange={e => setSupermarketId(e.target.value)} 
                            placeholder="Enter supermarket ID" 
                            className="px-3 py-2 w-full text-black"
                        />
                        <button 
                            onClick={handleSearch} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-gray-300 p-6 rounded-lg shadow-md">
                            <image src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                            <h2 className="text-2xl font-bold mt-4 text-black">{product.name}</h2>
                            <p className="mt-2 text-black">{product.description}</p>
                            <p className="mt-2 font-semibold text-black">Price: Rp{product.price}</p>
                            <p className="mt-2 text-black">Quantity: {product.quantity}</p>
                            <p className="mt-2 text-black">Supermarket ID: {product.supermarketId}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}