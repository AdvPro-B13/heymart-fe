'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkTokenValidity = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/check-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        router.push('/dashboard');
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Error checking token validity', error);
                    localStorage.removeItem('token');
                }
            }
        };

        checkTokenValidity();
    }, [router]);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            router.push('/dashboard'); 
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black py-2">
            <h1 className="text-4xl text-white mb-6">Login</h1>
            <form onSubmit={handleLogin} className="w-full max-w-xs">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Login
                </button>
            </form>
            <p className="text-white mt-4">Don&apos;t have an account? <button className="text-blue-500 hover:text-blue-700" onClick={() => router.push('/auth/register')}>Register</button></p>
        </div>
    );
}
