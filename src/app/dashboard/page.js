'use client';
import { useEffect, useState } from 'react';
import withAuth from '../../components/withAuth';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:8081/api/protected-endpoint', { // sesuaikan endpoint API kamu
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setData(data);
            } else {
                // Handle error
                setData({ message: 'Failed to fetch data' });
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black py-2">
            <h1 className="text-4xl text-white mb-6">RAFLI WIBU</h1>
        </div>
    );
};

export default withAuth(Dashboard);
