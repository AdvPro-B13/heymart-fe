'use client';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const SupermarketPage = ({ params }) => {
    const { supermarketId } = params;
    const router = useRouter();

    const handleViewCart = () => {
        router.push(`/supermarket/${supermarketId}/cart`);
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
                <h1 className="text-4xl text-white mb-6">Supermarket ID: {supermarketId}</h1>
                <button
                    onClick={handleViewCart}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default SupermarketPage;
