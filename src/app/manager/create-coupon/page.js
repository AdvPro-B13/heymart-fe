'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function CreateCoupon() {
    const [couponType, setCouponType] = useState('transaction');
    const [percentDiscount, setPercentDiscount] = useState('');
    const [fixedDiscount, setFixedDiscount] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [supermarketId, setSupermarketId] = useState('');
    const [minTransaction, setMinTransaction] = useState('');
    const [idProduct, setIdProduct] = useState('');
    const [accessStatus, setAccessStatus] = useState('loading');
    const router = useRouter();

    useEffect(() => {
        const fetchSupermarketId = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER_BASE_URL}/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    console.log('User data:', userData);
                    setSupermarketId(userData.supermarketId);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        const verifyAccess = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
        
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        action: 'coupon:create'
                    }),
                });
        
                const resultText = await res.text();
        
                if (res.ok) {
                    setAccessStatus(resultText);
                    if (resultText !== 'Authorized') {
                        router.push('/dashboard'); 
                    }
                } else {
                    setAccessStatus('Unauthorized');
                    router.push('/dashboard');
                }
            } catch (error) {
                setAccessStatus('Unauthorized');
                router.push('/dashboard');
            }
        };

        verifyAccess();
        fetchSupermarketId();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(maxDiscount) < parseFloat(fixedDiscount)) {
            alert('Max discount must be greater than or equal to fixed discount.');
            return;
        }

        const body = {
            percentDiscount: parseFloat(percentDiscount),
            fixedDiscount: parseFloat(fixedDiscount),
            maxDiscount: parseFloat(maxDiscount),
            supermarketId,
            ...(couponType === 'transaction' ? { minTransaction: parseInt(minTransaction) } : { idProduct })
        };

        const endpoint = couponType === 'transaction'
            ? `${process.env.NEXT_PUBLIC_API_TRANSACTION_COUPON_BASE_URL}/create`
            : `${process.env.NEXT_PUBLIC_API_PRODUCT_COUPON_BASE_URL}/create`;

        try {
            const token = localStorage.getItem('token');
            console.log('Request body:', body);
            console.log('Token:', token);
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.text();
                console.error('Failed to create coupon:', errorData);
                throw new Error(errorData || 'Failed to create coupon');
            }

            alert('Coupon created successfully');
            if (couponType === 'transaction') {
                router.push('/manager/transaction-coupons');
            } else {
                router.push('/manager/product-coupons');
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert(error.message);
        }
    };

    if (accessStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (accessStatus === 'Unauthorized') {
        return null;
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-2">
                <h1 className="text-4xl text-white mb-6">Create Coupon</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2">Coupon Type:</label>
                        <select
                            value={couponType}
                            onChange={(e) => setCouponType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                        >
                            <option value="transaction">Transaction Coupon</option>
                            <option value="product">Product Coupon</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2">Percent Discount:</label>
                        <input
                            type="number"
                            value={percentDiscount}
                            onChange={(e) => setPercentDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2">Fixed Discount:</label>
                        <input
                            type="number"
                            value={fixedDiscount}
                            onChange={(e) => setFixedDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2">Max Discount:</label>
                        <input
                            type="number"
                            value={maxDiscount}
                            onChange={(e) => setMaxDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                        />
                    </div>
                    {couponType === 'transaction' && (
                        <div className="mb-4">
                            <label className="block text-white font-bold mb-2">Min Transaction:</label>
                            <input
                                type="number"
                                value={minTransaction}
                                onChange={(e) => setMinTransaction(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                            />
                        </div>
                    )}
                    {couponType === 'product' && (
                        <div className="mb-4">
                            <label className="block text-white font-bold mb-2">Product ID:</label>
                            <input
                                type="text"
                                value={idProduct}
                                onChange={(e) => setIdProduct(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
                            />
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.push(couponType === 'transaction' ? '/manager/transaction-coupons' : '/manager/product-coupons')}
                            className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
