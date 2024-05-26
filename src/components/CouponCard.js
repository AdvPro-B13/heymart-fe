// src/components/CouponCard.js

'use client';

const CouponCard = ({ coupon }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
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
    );
};

export default CouponCard;
