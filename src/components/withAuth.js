import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const [role, setRole] = useState('');
        const [lastname, setLastname] = useState('');

        useEffect(() => {
            const checkTokenValidity = async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER_BASE_URL}/get`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (res.ok) {
                            const data = await res.json();
                            setRole(data.role);
                            setLastname(data.lastname);
                        } else {
                            localStorage.removeItem('token');
                            router.push('/auth/login');
                        }
                    } catch (error) {
                        console.error('Error checking token validity', error);
                        localStorage.removeItem('token');
                        router.push('/auth/login');
                    }
                } else {
                    router.push('/auth/login');
                }
            };

            checkTokenValidity();
        }, [router]);

        return <WrappedComponent {...props} role={role} lastname={lastname} />;
    };
};

export default withAuth;
