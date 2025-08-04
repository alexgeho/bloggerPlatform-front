import { useState } from 'react';
import axios from 'axios';

export default function EmailConfirmed() {
    const code = new URLSearchParams(window.location.hash.split('?')[1]).get('code');
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

    const handleConfirm = async () => {
        if (!code) return setStatus('error');
        setStatus('loading');
        try {
            await axios.post('https://blogger-platform-pi.vercel.app/auth/registration-confirmation', { code });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    if (!code) return <h2>❌ Invalid or missing confirmation code.</h2>;

    return (
        <div>
            <h2>Email Confirmation</h2>
            {status === 'idle' && <button onClick={handleConfirm}>Confirm Email</button>}
            {status === 'loading' && <p>Sending confirmation...</p>}
            {status === 'success' && <p>✅ Your email has been confirmed successfully!</p>}
            {status === 'error' && <p>❌ Confirmation failed. Try again later.</p>}
        </div>
    );
}
