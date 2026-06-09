import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconChart, IconPlus, IconList, IconBrain } from './icons.jsx';
import { getRole } from '../lib/api.js';
import { can } from '../lib/roles.js';

const ALL_ITEMS = [
  { to: '/dashboard',       label: 'Dashboard',         icon: IconChart, requires: null         },
  { to: '/evaluations/new', label: 'Nuova valutazione', icon: IconPlus,  requires: 'canCreate'  },
  { to: '/archive',         label: 'Archivio',          icon: IconList,  requires: null         },
];

export default function Sidebar() {
  const role = getRole();
  const items = ALL_ITEMS.filter((it) => !it.requires || can(role, it.requires));
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-primary text-white shrink-0 no-print">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <IconBrain className="w-7 h-7 text-accent-400" />
          <div>
            <div className="font-extrabold tracking-tight text-lg leading-none">E-STROKE</div>
            <div className="text-[10px] uppercase tracking-widest text-accent-100/80 mt-1">Early · Effective · Essential</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-white/10 text-[11px] text-white/50">
        <div>An App for Brain.</div>
        <div>An App for LIFE.</div>
      </div>
    </aside>
  );
}
