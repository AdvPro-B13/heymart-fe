'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

export default function ListCustomerCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchCoupons = async () => {
        const supermarketId = 'mart1'; 
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_COUPON_BASE_URL}/api/transaction-coupon/supermarket/${supermarketId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const couponData = await res.json();
                couponData.sort((a, b) => a.id.localeCompare(b.id)); // Sorting coupons by ID
                setCoupons(couponData);
                setFilteredCoupons(couponData); // Initialize filteredCoupons
            } else {
                console.error('Failed to fetch coupons');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    useEffect(() => {
        setFilteredCoupons(
            coupons.filter(coupon =>
                coupon.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, coupons]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">List Transaction Coupon</h1>
                <input
                    type="text"
                    placeholder="Search by Coupon ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 px-3 py-2 border rounded-lg bg-gray-700 text-white w-80"
                />
                {filteredCoupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCoupons.map((coupon) => (
                            <div key={coupon.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                <h3 className="text-xl text-white mb-2">Coupon ID: {coupon.id}</h3>
                                <p className="text-white">Percent Discount: {coupon.percentDiscount}%</p>
                                <p className="text-white">Fixed Discount: {coupon.fixedDiscount}</p>
                                <p className="text-white">Max Discount: {coupon.maxDiscount}</p>
                                <p className="text-white">Min Transaction: {coupon.minTransaction}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white">No coupons available</p>
                )}
            </div>
        </div>
    );
}
