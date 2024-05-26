'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import UpdateCouponModal from '../../../components/UpdateCouponModal';

export default function ListProductCoupon() {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [supermarketId, setSupermarketId] = useState('');
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);
    const [accessStatus, setAccessStatus] = useState('');
    const router = useRouter();

    const fetchCoupons = useCallback(async () => {
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
                const supermarketId = userData.supermarketId;
                setSupermarketId(supermarketId);

                const couponRes = await fetch(`${process.env.NEXT_PUBLIC_API_PRODUCT_COUPON_BASE_URL}/supermarket/${supermarketId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (couponRes.ok) {
                    const couponData = await couponRes.json();
                    couponData.sort((a, b) => a.id.localeCompare(b.id));
                    setCoupons(couponData);
                    setFilteredCoupons(couponData);
                } else {
                    console.error('Failed to fetch coupons');
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }, [router]);

    const verifyAccess = useCallback(async () => {
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
    }, [router]);

    useEffect(() => {
        verifyAccess();
        fetchCoupons();
    }, [verifyAccess, fetchCoupons]);

    useEffect(() => {
        setFilteredCoupons(
            coupons.filter(coupon =>
                coupon.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (coupon.idProduct && coupon.idProduct.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [searchTerm, coupons]);

    const handleCreate = () => {
        router.push('/manager/create-coupon');
    };

    const handleUpdate = (coupon) => {
        setCurrentCoupon(coupon);
        setShowUpdateForm(true);
    };

    const handleUpdateClose = () => {
        setCurrentCoupon(null);
        setShowUpdateForm(false);
        fetchCoupons();
    };

    const handleDelete = async (couponId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRODUCT_COUPON_BASE_URL}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id: couponId })
            });

            if (!res.ok) {
                throw new Error('Failed to delete coupon');
            }

            setCoupons(coupons.filter(coupon => coupon.id !== couponId));
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            {accessStatus === 'Authorized' ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                    <h1 className="text-4xl text-white mb-6">List Product Coupon</h1>
                    <h2 className="text-2xl text-white mb-4">Supermarket ID: {supermarketId}</h2>
                    <input
                        type="text"
                        placeholder="Search by Coupon ID or Product ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 px-3 py-2 border rounded-lg bg-gray-700 text-white w-80"
                    />
                    <button
                        onClick={handleCreate}
                        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Coupon
                    </button>
                    {showUpdateForm && (
                        <UpdateCouponModal
                            coupon={currentCoupon}
                            onClose={handleUpdateClose}
                            onUpdate={handleUpdateClose}
                        />
                    )}
                    {filteredCoupons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCoupons.map((coupon) => (
                                <div key={coupon.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                    <h3 className="text-xl text-white mb-2">Coupon ID: {coupon.id}</h3>
                                    <p className="text-white">Percent Discount: {coupon.percentDiscount}%</p>
                                    <p className="text-white">Fixed Discount: {coupon.fixedDiscount}</p>
                                    <p className="text-white">Max Discount: {coupon.maxDiscount}</p>
                                    <p className="text-white">Product ID: {coupon.idProduct}</p>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleUpdate(coupon)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white">No coupons available</p>
                    )}
                </div>
            ) : null}
        </div>
    );
}
