'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ categoryNames: [] });
    const [showModal, setShowModal] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "categoryNames") {
            const options = event.target.options;
            const selectedCategories = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selectedCategories.push(options[i].value);
                }
            }
            setNewProduct({
                ...newProduct,
                categoryNames: selectedCategories
            });
        } else {
            setNewProduct({
                ...newProduct,
                [name]: value
            });
        }
    };

    const openModal = (product = null) => {
        setNewProduct(product || { categoryNames: [] });
        setEditProductId(product ? product.id : null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleCreateOrUpdate = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const endpoint = editProductId
            ? `${process.env.NEXT_PUBLIC_API_PRODUCT_BASE_URL}/edit/${editProductId}`
            : `${process.env.NEXT_PUBLIC_API_PRODUCT_BASE_URL}/create`;
        const method = editProductId ? 'PUT' : 'POST';

        try {
            console.log('Sending request to:', endpoint);
            console.log('Request payload:', newProduct);

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newProduct),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const product = await res.json();
            console.log('Response received:', product);

            if (editProductId) {
                setProducts(products.map(p => p.id === editProductId ? product : p));
            } else {
                setProducts([...products, product]);
            }
            closeModal();
        } catch (error) {
            console.error('A problem occurred with the fetch operation: ', error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRODUCT_BASE_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (res.ok) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_CATEGORIES_BASE_URL}/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

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
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-300">
            <Navbar />
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-black">Products</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4" onClick={() => openModal()}>Create Product</button>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 relative">
                            <button className="absolute top-0 right-0 m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={closeModal}>X</button>
                            <form onSubmit={handleCreateOrUpdate}>
                                <div className="form-group mb-4">
                                    <label htmlFor="name" className="block text-gray-700">Name:</label>
                                    <input type="text" className="form-control w-full border border-gray-300 rounded-md p-2 text-black" id="name" name="name" value={newProduct.name || ''} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="description" className="block text-gray-700">Description:</label>
                                    <textarea className="form-control w-full border border-gray-300 rounded-md p-2 text-black" id="description" name="description" value={newProduct.description || ''} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="price" className="block text-gray-700">Price:</label>
                                    <input type="number" className="form-control w-full border border-gray-300 rounded-md p-2 text-black" id="price" name="price" value={newProduct.price || ''} onChange={handleInputChange} required step="0.01" min="0" />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="quantity" className="block text-gray-700">Quantity:</label>
                                    <input type="number" className="form-control w-full border border-gray-300 rounded-md p-2 text-black" id="quantity" name="quantity" value={newProduct.quantity || ''} onChange={handleInputChange} required min="0" />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="categoryNames" className="block text-gray-700">Categories:</label>
                                    <select id="categoryNames" name="categoryNames" className="form-control w-full border border-gray-300 rounded-md p-2 text-black" onChange={handleInputChange} multiple value={newProduct.categoryNames}>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">{editProductId ? 'Update' : 'Create'}</button>
                            </form>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                            <h2 className="text-2xl font-bold mt-4 text-black">{product.name}</h2>
                            <p className="mt-2 text-black">{product.description}</p>
                            <p className="mt-2 font-semibold text-black">Price: Rp{product.price}</p>
                            <p className="mt-2 text-black">Quantity: {product.quantity}</p>
                            <p className="mt-2 text-black">Supermarket ID: {product.supermarketId}</p>
                            <div className="flex justify-between mt-4">
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700" onClick={() => openModal(product)}>Edit</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={() => handleDelete(product.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
