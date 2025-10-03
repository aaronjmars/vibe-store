'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface App {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Generating app ideas...');

  useEffect(() => {
    // Try to load from localStorage first
    const cached = localStorage.getItem('vibe-apps');
    if (cached) {
      try {
        const parsedApps = JSON.parse(cached);
        setApps(parsedApps);
        setLoading(false);
      } catch (e) {
        generateApps();
      }
    } else {
      generateApps();
    }
  }, []);

  const generateApps = async () => {
    setLoading(true);
    setApps([]);
    localStorage.removeItem('vibe-apps');

    try {
      // Step 1: Generate all 15 app ideas in one request
      const ideasResponse = await fetch('/api/generate-app-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 15 }),
      });

      const { apps: ideas } = await ideasResponse.json();

      // Step 2: Create apps with placeholder thumbnails immediately
      const placeholderApps: App[] = ideas.map((idea: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        name: idea.name,
        description: idea.description,
        thumbnail: '', // Empty thumbnail initially
      }));

      setApps(placeholderApps);
      setLoading(false);

      // Save placeholder apps to localStorage
      localStorage.setItem('vibe-apps', JSON.stringify(placeholderApps));

      // Step 3: Generate thumbnails in parallel and update as they complete
      ideas.forEach((idea: any, i: number) => {
        fetch('/api/generate-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: idea.imagePrompt }),
        })
          .then((res) => res.json())
          .then((thumbnail) => {
            setApps((prevApps) => {
              const newApps = [...prevApps];
              newApps[i] = { ...newApps[i], thumbnail: thumbnail.url };

              // Update localStorage with new thumbnail
              localStorage.setItem('vibe-apps', JSON.stringify(newApps));

              return newApps;
            });
          })
          .catch(() => {
            // Silently fail - keep placeholder
          });
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a90e2] via-[#5fa3e8] to-[#7ab8ee] p-4">
      <div className="max-w-4xl mx-auto">
        {/* iOS 6 Status Bar */}
        <div className="h-5 bg-black/20 mb-4 rounded-t-lg flex items-center justify-between px-2 text-white text-xs">
          <span>9:41 AM</span>
          <span>📶 📡 🔋</span>
        </div>

        {/* App Store Header */}
        <div className="bg-gradient-to-b from-[#f7f7f7] to-[#e0e0e0] border-t border-white/50 p-4 shadow-lg rounded-lg mb-4">
          <h1 className="text-center text-2xl font-bold bg-gradient-to-b from-[#4d4d4d] to-[#1a1a1a] bg-clip-text text-transparent">
            Vibe App Store
          </h1>
          <button
            onClick={generateApps}
            className="mt-2 w-full bg-gradient-to-b from-[#fcfcfc] to-[#d4d4d4] border border-[#a0a0a0] rounded-lg px-4 py-2 text-sm font-semibold text-[#2a2a2a] shadow-md active:shadow-inner"
          >
            🔄 Refresh Apps
          </button>
        </div>

        {/* App Grid */}
        <div className="bg-gradient-to-b from-[#f7f7f7] to-[#e0e0e0] border-t border-white/50 p-6 shadow-lg rounded-lg">
          {loading && apps.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4">Loading awesome apps...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  href={`/app/${encodeURIComponent(app.id)}?id=${encodeURIComponent(
                    app.id
                  )}&name=${encodeURIComponent(
                    app.name
                  )}&description=${encodeURIComponent(app.description)}`}
                  className="flex flex-col items-center group"
                >
                  {/* iOS 6 Style Icon */}
                  <div className="relative w-20 h-20 mb-2 rounded-xl overflow-hidden shadow-lg border border-black/20 bg-white group-active:scale-95 transition-transform">
                    {app.thumbnail ? (
                      <img
                        src={app.thumbnail}
                        alt={app.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                        <div className="animate-pulse text-white text-3xl">✨</div>
                      </div>
                    )}
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"></div>
                  </div>
                  <span className="text-xs text-center text-white font-semibold drop-shadow-md max-w-full truncate px-1">
                    {app.name}
                  </span>
                </Link>
              ))}
              {/* Show loading placeholders for remaining apps */}
              {loading &&
                Array.from({ length: 15 - apps.length }).map((_, i) => (
                  <div key={`loading-${i}`} className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-2 rounded-xl bg-gray-300 animate-pulse shadow-lg"></div>
                    <div className="w-16 h-3 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* iOS 6 Dock */}
        <div className="mt-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <div className="flex justify-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-green-400 to-green-600 shadow-lg flex items-center justify-center text-2xl">
              📞
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg flex items-center justify-center text-2xl">
              ✉️
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 shadow-lg flex items-center justify-center text-2xl">
              🌐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
