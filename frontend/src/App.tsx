import { useEffect, useState } from 'react';
import { apiRequest } from './api/http';

type HealthResponse = { status: string };

export function App() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('Checking API status...');

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');

    apiRequest<HealthResponse>('/health')
      .then((data) => {
        if (!isMounted) return;
        setStatus('ok');
        setMessage(`API status: ${data.status}`);
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unable to reach API');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page">
      <main className="card">
        <h1>ClientVault</h1>
        <p className="subtitle">Your deployment is live.</p>
        <div className={`status status--${status}`}>
          <span className="dot" />
          <span>{message}</span>
        </div>
        <p className="hint">
          If the status is failing, verify <code>MONGO_URI</code>, <code>JWT_SECRET</code>, and
          <code> CORS_ORIGIN</code> in Vercel.
        </p>
      </main>
    </div>
  );
}
