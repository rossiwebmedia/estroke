import React from 'react';

const tone = {
  primary: 'bg-primary text-white',
  accent:  'bg-accent text-white',
  success: 'bg-success text-white',
  danger:  'bg-danger text-white',
  neutral: 'bg-white text-primary border border-primary-50',
};

export default function DashboardCard({ label, value, sub, icon: Icon, color = 'neutral' }) {
  const isLight = color === 'neutral';
  return (
    <div className={`rounded-2xl shadow-card p-5 flex items-start justify-between gap-4 ${tone[color]}`}>
      <div>
        <div className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-primary-700' : 'text-white/70'}`}>
          {label}
        </div>
        <div className={`mt-2 text-3xl font-extrabold ${isLight ? 'text-primary-900' : 'text-white'}`}>
          {value}
        </div>
        {sub && (
          <div className={`mt-1 text-xs ${isLight ? 'text-primary-700/70' : 'text-white/70'}`}>
            {sub}
          </div>
        )}
      </div>
      {Icon && (
        <div className={`p-2 rounded-lg ${isLight ? 'bg-primary-50 text-primary' : 'bg-white/15 text-white'}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
