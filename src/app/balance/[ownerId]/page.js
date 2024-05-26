// src/app/balance/[ownerId]/page.js
'use client';
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function BalancePage() {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accessStatus, setAccessStatus] = useState('');
    const router = useRouter();

    const fetchBalanceAndTransactions = async (ownerId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            const balanceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_USER_BASE_URL}/balance/${ownerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const transactionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSACTION_COUPON_BASE_URL}/transactions/${ownerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (balanceResponse.ok && transactionsResponse.ok) {
                const balanceData = await balanceResponse.json();
                const transactionsData = await transactionsResponse.json();
                setBalance(balanceData);
                setTransactions(transactionsData);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const verifyAccess = async () => {
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
                    action: 'balance:view'
                }),
            });

            const resultText = await res.text();
            if (res.ok && resultText === 'Authorized') {
                setAccessStatus('Authorized');
            } else {
                setAccessStatus('Unauthorized');
                router.push('/dashboard');
            }
        } catch (error) {
            setAccessStatus('Unauthorized');
            router.push('/dashboard');
        }
    };

    useEffect(() => {
        verifyAccess();
        if (router.query.ownerId) {
            fetchBalanceAndTransactions(router.query.ownerId);
        }
    }, [router.query.ownerId]);

    if (loading) return <p>Loading...</p>;
    if (accessStatus !== 'Authorized') return null;

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">User Balance and Transactions</h1>
                {balance && (
                    <div className="text-xl text-white">
                        <p>Balance: ${balance.balance.toFixed(2)}</p>
                        <p>Owner ID: {balance.ownerId}</p>
                    </div>
                )}
                <div className="mt-6 w-full max-w-4xl">
                    <h2 className="text-2xl text-white mb-4">Transactions</h2>
                    {transactions.length > 0 ? (
                        <ul>
                            {transactions.map(transaction => (
                                <li key={transaction.id} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <p>Date: {new Date(transaction.transactionDate).toLocaleString()}</p>
                                    <p>Amount: ${transaction.amount.toFixed(2)}</p>
                                    <p>Type: {transaction.transactionType}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">No transactions available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

