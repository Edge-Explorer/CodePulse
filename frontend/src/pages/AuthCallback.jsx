import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const avatar_url = searchParams.get('avatar_url');
        const user_id = searchParams.get('user_id');

        if (token && username) {
            // Save session to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username,
                avatar_url,
                user_id,
            }));

            // Redirect to home — the Navbar will detect the user
            window.location.href = '/';
        } else {
            console.error('Authentication failed: missing token or username in callback URL');
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-400 font-medium animate-pulse">Authenticating with CodePulse Hub...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
