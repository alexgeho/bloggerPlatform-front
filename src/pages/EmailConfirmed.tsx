import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function EmailConfirmed() {
    const [searchParams] = useSearchParams();
    const [status, setStatus]
        = useState<'pending' | 'success' | 'error'>('pending');
    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            return;
        }

        axios
            .post('/api/auth/verify-email', { code })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [code]);

    if (status === 'pending') return <p>Verifying email...</p>;
    if (status === 'success') return <h2>✅ Email successfully verified!</h2>;
    return <h2>❌ Verification failed. The link is invalid or already used.</h2>;
}