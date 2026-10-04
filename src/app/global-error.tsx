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
      <body style={{ backgroundColor: '#0d0b06', color: '#e6ca65', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ maxWidth: '480px', width: '100%', border: '1px solid rgba(230, 202, 101, 0.4)', padding: '32px', textAlign: 'center', backgroundColor: '#18140c', borderRadius: '4px' }}>
            <h1 style={{ fontSize: '24px', margin: '0 0 12px 0', letterSpacing: '0.1em' }}>AMBIKA JEWELS</h1>
            <p style={{ color: '#d1c7b7', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              We experienced a temporary system error. Please refresh or retry loading the application.
            </p>
            {error.digest && (
              <div style={{ fontSize: '11px', color: '#9b9080', marginBottom: '20px' }}>
                Incident ID: {error.digest}
              </div>
            )}
            <button
              onClick={() => reset()}
              style={{
                background: 'linear-gradient(135deg, #e6ca65 0%, #c4a747 100%)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '2px',
                fontSize: '12px',
                letterSpacing: '0.1em'
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
