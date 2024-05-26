'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

export default function SupermarketList() {
    const [supermarkets, setSupermarkets] = useState([]);
    const router = useRouter();

    // Dummy supermarket data
    useEffect(() => {
        setSupermarkets([
            { id: 'raflimart', name: 'Raflimart' },
            { id: 'mart1', name: 'Bimomart' },
        ]);
    }, []);

    const handleSupermarketClick = (id) => {
        router.push(`/supermarket/${id}`);
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">Supermarkets</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {supermarkets.map((supermarket) => (
                        <div 
                            key={supermarket.id} 
                            className="bg-gray-800 p-4 rounded-lg shadow-lg text-white cursor-pointer"
                            onClick={() => handleSupermarketClick(supermarket.id)}
                        >
                            <h3 className="text-xl font-bold mb-2">{supermarket.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
