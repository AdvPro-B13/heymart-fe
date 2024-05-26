'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black py-2">
            <h1 className="text-4xl text-white mb-6">Logging out...</h1>
        </div>
    );
}
