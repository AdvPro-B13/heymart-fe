'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/dashboard">Heymart</Link>
                </div>
                <div className="space-x-4">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-gray-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => router.push('/auth/login')}
                                className="text-white hover:text-gray-400"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => router.push('/auth/register')}
                                className="text-white hover:text-gray-400"
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
