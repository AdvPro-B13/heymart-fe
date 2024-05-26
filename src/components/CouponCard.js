'use client';
import { useCouponContext } from '../context/CouponContext';

const CouponCard = ({ coupon }) => {
    const { activeCoupon, equipCoupon, cancelCoupon } = useCouponContext();

    const handleUseClick = () => {
        if (activeCoupon && activeCoupon.id === coupon.id) {
            cancelCoupon();
        } else {
            equipCoupon(coupon);
        }
    };

    return (
        <div className="coupon-card bg-gray-800 p-4 rounded-lg shadow-lg">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">
                    {coupon.percentDiscount ? `Diskon transaksi ${coupon.percentDiscount}%, maks. Rp${coupon.maxDiscount}` : `Diskon transaksi sebesar Rp${coupon.fixedDiscount}`}
                </h3>
                <p className="text-gray-400">Use with RafliPay atau 7 lainnya</p>
                <p className="text-gray-400">
                    {coupon.percentDiscount && coupon.fixedDiscount ? `Tambahan diskon transaksi Rp${coupon.fixedDiscount}` : ''}
                </p>
                <p className="text-gray-400">Min. transaksi Rp{coupon.minTransaction}</p>
                <p className="text-orange-500">Kelar jam 21:00</p>
            </div>
            <button
                onClick={handleUseClick}
                className={`mt-4 py-2 px-4 rounded ${activeCoupon && activeCoupon.id === coupon.id ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold`}
            >
                {activeCoupon && activeCoupon.id === coupon.id ? 'Cancel' : 'Use'}
            </button>
        </div>
    );
};

export default CouponCard;
