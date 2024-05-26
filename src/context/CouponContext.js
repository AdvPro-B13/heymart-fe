'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
    const [activeCoupon, setActiveCoupon] = useState(null);

    useEffect(() => {
        const savedCoupon = localStorage.getItem('activeCoupon');
        if (savedCoupon) {
            setActiveCoupon(JSON.parse(savedCoupon));
        }
    }, []);

    useEffect(() => {
        if (activeCoupon) {
            localStorage.setItem('activeCoupon', JSON.stringify(activeCoupon));
        } else {
            localStorage.removeItem('activeCoupon');
        }
    }, [activeCoupon]);

    const useCoupon = (coupon) => {
        setActiveCoupon(coupon);
    };

    const cancelCoupon = () => {
        setActiveCoupon(null);
    };

    return (
        <CouponContext.Provider value={{ activeCoupon, useCoupon, cancelCoupon }}>
            {children}
        </CouponContext.Provider>
    );
};

export const useCouponContext = () => useContext(CouponContext);
