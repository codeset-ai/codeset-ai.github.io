"use client"

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [processed, setProcessed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      if (processed) {
        console.log('OAuth already processed, skipping...');
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      console.log('Processing OAuth callback...', { code: code?.substring(0, 10) + '...', state, error: errorParam });

      if (errorParam) {
        setError(errorParam);
        setStatus('error');
        setProcessed(true);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setStatus('error');
        setProcessed(true);
        return;
      }

      setProcessed(true);

      const attemptOAuth = async (retryCount = 0): Promise<void> => {
        try {
          console.log(`OAuth attempt ${retryCount + 1}...`);
          const oauthResult = await AuthService.githubOAuth(code, state || undefined);
          console.log('OAuth successful, result:', oauthResult);

          setStatus('success');

          // Give the token a moment to be valid, then update user data and redirect
          setTimeout(async () => {
            console.log('Refreshing user data after delay...');
            await refreshUser();
            console.log('User data refreshed, redirecting...');
            router.push('/dashboard');
          }, 500);
        } catch (err) {
          console.error(`OAuth attempt ${retryCount + 1} failed:`, err);

          // Retry once if it's the first attempt
          if (retryCount === 0) {
            console.log('Retrying OAuth in 1 second...');
            setTimeout(() => attemptOAuth(1), 1000);
            return;
          }

          // After retries failed, show error
          console.error('All OAuth attempts failed');
          setError(err instanceof Error ? err.message : 'Authentication failed');
          setStatus('error');
        }
      };

      await attemptOAuth();
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center font-mono">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating with GitHub...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-600 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">Login successful! Redirecting...</p>
          </div>
        )}

        {status === 'error' && processed && (
          <div>
            <div className="text-red-600 mb-4">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-600 mb-2">Authentication failed</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}