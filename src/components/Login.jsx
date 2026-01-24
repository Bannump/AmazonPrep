import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%', backgroundColor: '#18181b', borderRadius: '0.5rem', padding: '2rem', border: '1px solid #27272a' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fafafa', marginBottom: '1rem' }}>
            Amazon Interview Prep
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '2rem' }}>
            Sign in to track your personalized progress
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '0.5rem' }}>
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: loading ? '#52525b' : '#3b82f6',
            color: '#fff',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#71717a' }}>
          By signing in, you agree to store your progress data securely
        </p>
      </div>
    </div>
  );
};

export default Login;
