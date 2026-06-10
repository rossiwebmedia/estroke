import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IconLogout, IconBrain, IconSun, IconMoon } from './icons.jsx';
import { clearRole, getRole } from '../lib/api.js';
import { useTheme } from '../lib/useTheme.js';

export default function Header() {
  const navigate = useNavigate();
  const role = getRole();
  const { theme, toggleTheme } = useTheme();

  function logout() {
    clearRole();
    navigate('/');
  }

  return (
    <header className="bg-white border-b border-primary-50 px-4 lg:px-8 py-3 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2 text-primary">
          <IconBrain className="w-6 h-6 text-accent" />
          <span className="font-extrabold tracking-tight">E-STROKE</span>
        </Link>
        <h1 className="hidden lg:block text-sm text-primary-700">
          <span className="text-primary-100">/</span> Triage pre-ospedaliero
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {role && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="font-medium">{role}</span>
          </div>
        )}
        <button onClick={toggleTheme} className="btn-ghost text-sm py-2 px-3" aria-label={theme === 'dark' ? 'Passa a tema chiaro' : 'Passa a tema scuro'} title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}>
          {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
        </button>
        <button onClick={logout} className="btn-ghost text-sm py-2 px-3" aria-label="Esci">
          <IconLogout className="w-4 h-4" />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </header>
  );
}
