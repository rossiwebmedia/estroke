import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import DisclaimerBanner from './DisclaimerBanner.jsx';
import { getRole } from '../lib/api.js';

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getRole()) navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-full flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DisclaimerBanner />
        <Header />
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
