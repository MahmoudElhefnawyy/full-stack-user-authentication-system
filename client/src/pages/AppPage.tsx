import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { ProfileResponse } from '../types/auth.types';

export default function AppPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authService
      .getProfile()
      .then(setProfile)
      .catch(() => {
        // Token invalid or expired — clear it and force re-login
        authService.logout();
        navigate('/signin', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/signin', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="spinner" style={{ width: '2rem', height: '2rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-lg p-10 text-center">
        {/* Avatar */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-400/30 mb-6">
          <span className="text-3xl font-bold text-indigo-300">
            {profile?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>

        {/* Required message */}
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to the application.</h1>

        {/* User info */}
        <p className="text-lg text-indigo-300 font-medium mb-1">{profile?.name}</p>
        <p className="text-slate-400 text-sm mb-8">{profile?.email}</p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/15 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}
