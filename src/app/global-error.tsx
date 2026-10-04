'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Ambika Jewels | System Recovery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ backgroundColor: '#FAF7F2', color: '#1A1110', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ maxWidth: '480px', width: '100%', border: '1px solid rgba(158, 122, 35, 0.20)', padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '2px', boxShadow: '0 4px 20px rgba(30, 20, 18, 0.05)' }}>
            <h1 style={{ fontSize: '24px', margin: '0 0 12px 0', letterSpacing: '0.15em', color: '#9E7A23', fontFamily: 'serif' }}>AMBIKA JEWELS</h1>
            <p style={{ color: '#685953', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              We experienced a temporary system error. Please refresh or retry loading the application.
            </p>
            {error.digest && (
              <div style={{ fontSize: '11px', color: '#685953', opacity: 0.7, marginBottom: '20px', fontFamily: 'monospace' }}>
                Incident ID: {error.digest}
              </div>
            )}
            <button
              onClick={() => reset()}
              style={{
                background: '#9E7A23',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 28px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '2px',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
