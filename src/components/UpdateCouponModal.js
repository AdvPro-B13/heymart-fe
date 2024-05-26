'use client';
import { useState } from 'react';

export default function UpdateCouponModal({ coupon, onClose, onUpdate }) {
    const [percentDiscount, setPercentDiscount] = useState(coupon.percentDiscount);
    const [fixedDiscount, setFixedDiscount] = useState(coupon.fixedDiscount);
    const [maxDiscount, setMaxDiscount] = useState(coupon.maxDiscount);
    const [minTransaction, setMinTransaction] = useState(coupon.minTransaction || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            id: coupon.id,
            percentDiscount: parseFloat(percentDiscount),
            fixedDiscount: parseFloat(fixedDiscount),
            maxDiscount: parseFloat(maxDiscount),
            supermarketId: coupon.supermarketId,
            ...(coupon.minTransaction ? { minTransaction: parseInt(minTransaction) } : {})
        };

        const endpoint = coupon.minTransaction !== undefined
            ? 'http://localhost:8080/api/transaction-coupon/update'
            : 'http://localhost:8080/api/product-coupon/update';

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Failed to update coupon:', errorData);
                throw new Error(errorData.message || 'Failed to update coupon');
            }

            alert('Coupon updated successfully');
            onUpdate();
        } catch (error) {
            console.error('Error updating coupon:', error);
            alert(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl text-white font-bold mb-4">Update Coupon</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 font-bold mb-2">Percent Discount:</label>
                        <input
                            type="number"
                            value={percentDiscount}
                            onChange={(e) => setPercentDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-gray-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 font-bold mb-2">Fixed Discount:</label>
                        <input
                            type="number"
                            value={fixedDiscount}
                            onChange={(e) => setFixedDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-gray-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 font-bold mb-2">Max Discount:</label>
                        <input
                            type="number"
                            value={maxDiscount}
                            onChange={(e) => setMaxDiscount(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-gray-200"
                        />
                    </div>
                    {coupon.minTransaction !== undefined && (
                        <div className="mb-4">
                            <label className="block text-gray-300 font-bold mb-2">Min Transaction:</label>
                            <input
                                type="number"
                                value={minTransaction}
                                onChange={(e) => setMinTransaction(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-gray-200"
                            />
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
