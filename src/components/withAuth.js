import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const checkTokenValidity = async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const res = await fetch('http://localhost:8081/api/auth/check-token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (!res.ok) {
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

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
