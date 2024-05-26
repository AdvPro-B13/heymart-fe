// src/app/coupons/[supermarketId]/page.js

'use client';
import { useEffect, useState } from 'react';
import CouponCard from '../../../components/CouponCard';
import Navbar from '../../../components/Navbar';

const CouponPage = ({ params }) => {
    const { supermarketId } = params;
    const [coupons, setCoupons] = useState([]);

    const fetchCoupons = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSACTION_COUPON_BASE_URL}/supermarket/${supermarketId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                data.sort((a, b) => a.id.localeCompare(b.id));
                setCoupons(data);
            } else {
                console.error('Failed to fetch coupons');
            }
        } catch (error) {
            console.error('Error fetching coupons', error);
        }
    };

    useEffect(() => {
        if (supermarketId) {
            fetchCoupons();
        }
    }, [supermarketId]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">Coupons for Supermarket ID: {supermarketId}</h1>
                {coupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coupons.map((coupon) => (
                            <CouponCard key={coupon.id} coupon={coupon} />
                        ))}
                    </div>
                ) : (
                    <p className="text-white">No coupons available</p>
                )}
            </div>
        </div>
    );
};

export default CouponPage;
