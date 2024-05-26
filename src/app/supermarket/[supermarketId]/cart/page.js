'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';
import { useCouponContext } from '../../../../context/CouponContext';

const CartPage = ({ params }) => {
    const { supermarketId } = params;
    const router = useRouter();
    const searchParams = useSearchParams();
    const discount = searchParams.get('discount') ? parseFloat(searchParams.get('discount')) : 0;
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountedTotal, setDiscountedTotal] = useState(0);
    const { activeCoupon, equipCoupon, cancelCoupon } = useCouponContext();

    useEffect(() => {
        // Dummy cart data
        const items = [
            { id: 1, name: 'Item 1', price: 30000 },
            { id: 2, name: 'Item 2', price: 50000 },
            { id: 3, name: 'Item 3', price: 20000 },
        ];
        const total = items.reduce((sum, item) => sum + item.price, 0);
        const discountedTotal = total - discount;

        setCartItems(items);
        setTotalAmount(total);
        setDiscountedTotal(discountedTotal > 0 ? discountedTotal : 0); // Ensure total does not go negative
    }, [discount]);

    const handleShowCoupons = () => {
        router.push(`/coupons/${supermarketId}`);
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        if (activeCoupon) {
            try {
                const res = await fetch('http://35.240.170.2/api/transaction-coupon/use', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ id: activeCoupon.id }),
                });

                if (res.ok) {
                    alert('Coupon used successfully');
                    cancelCoupon();
                } else {
                    const errorData = await res.text();
                    alert(`Failed to use coupon: ${errorData}`);
                }
            } catch (error) {
                console.error('Error using coupon', error);
                alert('Error using coupon');
            }
        }
        router.push('/dashboard');
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">Cart for Supermarket ID: {supermarketId}</h1>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">Cart Items</h3>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id} className="mb-2">
                                {item.name}: Rp{item.price}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <h4 className="text-lg font-bold">Total: Rp{totalAmount}</h4>
                        {activeCoupon && (
                            <div className="bg-gray-700 text-white p-4 rounded-lg mb-6">
                                <h3>Percent Discount: {activeCoupon.percentDiscount}% * Rp100000 = Rp{activeCoupon.percentDiscount * 1000}</h3>
                                <h3>Fixed Discount: Rp{activeCoupon.fixedDiscount}</h3>
                                <p>Total after discount: Rp{100000 - activeCoupon.fixedDiscount - activeCoupon.percentDiscount * 1000}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleShowCoupons}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                    >
                        Show Coupons
                    </button>
                    <button
                        onClick={handleCheckout}
                        className={`mt-4 py-2 px-4 rounded w-full bg-green-500 hover:bg-green-700 text-white font-bold`}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
