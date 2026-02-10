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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg p-6 sm:p-8 border border-zinc-800">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2 sm:mb-3">
            Amazon Interview Prep
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Sign in to track your personalized progress
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-950 border border-red-900 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base sm:text-lg transition-colors min-h-[48px] touch-manipulation"
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-zinc-500">
          By signing in, you agree to store your progress data securely
        </p>
      </div>
    </div>
  );
};

export default Login;
