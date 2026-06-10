// Icone SVG inline — niente librerie esterne.
// Tutte ricevono className per controllare dimensioni/colore.
import React from 'react';

const base = 'inline-block flex-shrink-0';

export const IconBrain = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 3a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1 4.5 3 3 0 0 0 4 3.5h0V3z" />
    <path d="M14.5 3a3 3 0 0 1 3 3v1a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1 4.5 3 3 0 0 1-4 3.5h0V3z" />
    <path d="M12 6v12" />
  </svg>
);

export const IconHospital = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22V8l8-5 8 5v14" />
    <path d="M9 22v-6h6v6" />
    <path d="M12 9v5M9.5 11.5h5" />
  </svg>
);

export const IconAmbulance = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17V7h10v10" />
    <path d="M12 10h5l4 4v3" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
    <path d="M6 12h2v-2M5 11h4" />
  </svg>
);

export const IconClock = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconChart = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const IconList = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconPlus = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconPrinter = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </svg>
);

export const IconTrash = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </svg>
);

export const IconCheck = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const IconAlert = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);

export const IconArrowRight = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const IconArrowLeft = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M11 19l-7-7 7-7" />
  </svg>
);

export const IconPhone = ({ className = 'w-6 h-6' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 15.5a17 17 0 0 1-7.4-1.7l-1.7 2.6a13.5 13.5 0 0 0 6.2 3.4l1.2-1.2a1 1 0 0 1 1-.3l4.3 1A1 1 0 0 1 24 20.6V22a2 2 0 0 1-2 2A20 20 0 0 1 0 4a2 2 0 0 1 2-2h1.4a1 1 0 0 1 1 .8l1 4.3a1 1 0 0 1-.3 1L3.9 9.3A13.5 13.5 0 0 0 7.3 15.5l2.6-1.7a17 17 0 0 1-1.7-7.4 17 17 0 0 1 1.7-7.4l-2.6-1.7" transform="translate(0 0)" />
  </svg>
);

export const IconLogout = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconSun = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const IconMoon = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const IconMic = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8" />
  </svg>
);

export const IconSearch = ({ className = 'w-5 h-5' }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
