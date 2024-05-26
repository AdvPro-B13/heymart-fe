'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCouponDropdown, setShowCouponDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserRole(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserRole = async (token) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER_BASE_URL}/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setRole(data.role);
            } else {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error fetching user role', error);
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/">HeyMart</Link>
                </div>
                <div className="relative space-x-4">
                    <>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="text-white hover:text-gray-400"
                        >
                            Dashboard
                        </button>
                        {role === 'MANAGER' && (
                            <>
                                <div className="relative inline-block">
                                    <button 
                                        onClick={() => setShowProductDropdown(!showProductDropdown)}
                                        className="text-white hover:text-gray-400"
                                    >
                                        Manage Products
                                    </button>
                                    {showProductDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                            <Link href="/manager/products" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Manage All Products
                                            </Link>
                                            <Link href="/manager/products/supermarket" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Search by supermarket
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="relative inline-block">
                                    <button 
                                        onClick={() => setShowCouponDropdown(!showCouponDropdown)}
                                        className="text-white hover:text-gray-400"
                                    >
                                        List Coupon
                                    </button>
                                    {showCouponDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                            <Link href="/manager/transaction-coupons" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Transaction Coupons
                                            </Link>
                                            <Link href="/manager/product-coupons" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                Product Coupons
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {role === 'CUSTOMER' && (
                            <button 
                                onClick={() => router.push('/supermarket')}
                                className="text-white hover:text-gray-400"
                            >
                                Supermarket
                            </button>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="text-white hover:text-gray-400"
                        >
                            Logout
                        </button>
                    </>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
