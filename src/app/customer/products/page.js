'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRODUCT_BASE_URL}/list`, {
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

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-300">
            <Navbar />
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-black">Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
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