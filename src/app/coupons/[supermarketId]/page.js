'use client';
import { useEffect, useState } from 'react';
import CouponCard from '../../../components/CouponCard';
import Navbar from '../../../components/Navbar';

const CouponPage = ({ params }) => {
    const { supermarketId } = params;
    const [coupons, setCoupons] = useState([]);
    const [usedCoupons, setUsedCoupons] = useState([]);
    const [activeCoupon, setActiveCoupon] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

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

    const fetchUsedCoupons = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSACTION_COUPON_BASE_URL}/used-coupon/${supermarketId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUsedCoupons(data.map(c => c.couponId));
            } else {
                console.error('Failed to fetch used coupons');
            }
        } catch (error) {
            console.error('Error fetching used coupons', error);
        }
    };

    useEffect(() => {
        if (supermarketId) {
            fetchCoupons();
            fetchUsedCoupons();
        }
    }, [supermarketId]);

    const handleUseCoupon = (coupon) => {
        if (activeCoupon) {
            setSelectedCoupon(coupon);
            setShowConfirmation(true);
        } else {
            setActiveCoupon(coupon);
        }
    };

    const handleConfirmChange = () => {
        setActiveCoupon(selectedCoupon);
        setShowConfirmation(false);
        setSelectedCoupon(null);
    };

    const handleCancelChange = () => {
        setShowConfirmation(false);
        setSelectedCoupon(null);
    };

    const handleCancelCoupon = () => {
        setActiveCoupon(null);
    };

    const filteredCoupons = coupons.filter(coupon => !usedCoupons.includes(coupon.id));

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">Coupons for Supermarket ID: {supermarketId}</h1>
                {activeCoupon && (
                    <div className="bg-gray-700 text-white p-4 rounded-lg mb-6">
                        <h3>Using Coupon: {activeCoupon.id}</h3>
                        <button onClick={handleCancelCoupon} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                            Cancel Coupon
                        </button>
                    </div>
                )}
                {filteredCoupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCoupons.map((coupon) => (
                            <CouponCard key={coupon.id} coupon={coupon} onUseCoupon={handleUseCoupon} />
                        ))}
                    </div>
                ) : (
                    <p className="text-white">No coupons available</p>
                )}
                {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Change Coupon</h2>
                            <p>Are you sure you want to change the active coupon to {selectedCoupon.id}?</p>
                            <div className="mt-4 flex justify-end">
                                <button onClick={handleCancelChange} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                                    Cancel
                                </button>
                                <button onClick={handleConfirmChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponPage;