'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AppPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'App';
  const description = searchParams.get('description') || '';
  const id = searchParams.get('id') || '';

  const [demoUrl, setDemoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    const generate = async () => {
      try {
        setLoading(true);
        setError('');

        // Check cache first
        const cacheKey = `v0-app-${id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setDemoUrl(cached);
          setLoading(false);
          return;
        }

        const response = await fetch('/api/generate-v0-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Create a ${name} app inspired by this prompt: ${description}. Make it functional and interactive.`
          }),
        });

        if (cancelled) return;

        const data = await response.json();

        if (cancelled) return;

        // If timeout or error, redirect to v0 web URL
        if (!response.ok) {
          if (data.webUrl) {
            window.location.href = data.webUrl;
            return;
          }
          throw new Error(data.error || 'Failed to generate app');
        }

        if (data.demoUrl) {
          setDemoUrl(data.demoUrl);
          // Cache the demo URL
          localStorage.setItem(cacheKey, data.demoUrl);
        } else {
          throw new Error('No demo URL generated');
        }

        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to generate app. Please try again.');
        setLoading(false);
      }
    };

    generate();

    return () => {
      cancelled = true;
    };
  }, [name, description, id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a90e2] via-[#5fa3e8] to-[#7ab8ee] p-4">
      <div className="max-w-6xl mx-auto">
        {/* iOS 6 Style Header */}
        <div className="bg-gradient-to-b from-[#f7f7f7] to-[#e0e0e0] border-t border-white/50 p-4 shadow-lg rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-gradient-to-b from-[#fcfcfc] to-[#d4d4d4] border border-[#a0a0a0] rounded-lg px-4 py-2 text-sm font-semibold text-[#2a2a2a] shadow-md active:shadow-inner"
            >
              ← Back
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-b from-[#4d4d4d] to-[#1a1a1a] bg-clip-text text-transparent">
                {name}
              </h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>

        {/* App Container */}
        <div className="bg-gradient-to-b from-[#f7f7f7] to-[#e0e0e0] border-t border-white/50 shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 px-4">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Generating your app...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 px-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-gray-600 text-lg">{error}</p>
              <Link
                href="/"
                className="mt-4 inline-block bg-gradient-to-b from-[#fcfcfc] to-[#d4d4d4] border border-[#a0a0a0] rounded-lg px-6 py-3 text-sm font-semibold text-[#2a2a2a] shadow-md active:shadow-inner"
              >
                ← Go Back
              </Link>
            </div>
          ) : (
            <div className="w-full h-[calc(100vh-180px)]">
              <iframe
                src={demoUrl}
                className="w-full h-full border-0"
                title={name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
