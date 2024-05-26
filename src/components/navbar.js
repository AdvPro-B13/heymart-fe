'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
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
                                <button 
                                    onClick={() => router.push('/manager/products')}
                                    className="text-white hover:text-gray-400"
                                >
                                    List Product
                                </button>
                                <div className="relative inline-block">
                                    <button 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="text-white hover:text-gray-400"
                                    >
                                        List Coupon
                                    </button>
                                    {showDropdown && (
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
