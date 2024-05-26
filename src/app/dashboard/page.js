'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import withAuth from '../../components/withAuth';

const Dashboard = ({ role, lastname }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER_BASE_URL}/protected-endpoint`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setData(data);
            } else {
                setData({ message: 'Failed to fetch data' });
            }
        };

        fetchData();
    }, []);

    const renderDashboard = () => {
        if (role === 'ADMIN') {
            return <AdminDashboard />;
        } else if (role === 'CUSTOMER') {
            return <CustomerDashboard />;
        } else if (role === 'MANAGER') {
            return <ManagerDashboard />;
        } else {
            return <p className="text-white">Unauthorized</p>;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-2">
                <h1 className="text-4xl text-white mb-6">Dashboard</h1>
                <h2 className="text-2xl text-white mb-6">Welcome, {lastname}</h2>
                {data ? renderDashboard() : <p className="text-white">Loading...</p>}
            </div>
        </div>
    );
};

const AdminDashboard = () => (
    <div className="text-white">
        <h2>Admin Dashboard</h2>
        {/* Konten khusus untuk admin */}
    </div>
);

const CustomerDashboard = () => (
    <div className="text-white">
        <h2>Customer Dashboard</h2>
        {/* Konten khusus untuk customer */}
    </div>
);

const ManagerDashboard = () => (
    <div className="text-white">
        <h2>Manager Dashboard</h2>
        {/* Konten khusus untuk manager */}
    </div>
);

export default withAuth(Dashboard);
