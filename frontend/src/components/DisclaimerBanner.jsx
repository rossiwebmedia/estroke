import React from 'react';
import { IconAlert } from './icons.jsx';

export default function DisclaimerBanner() {
  return (
    <div className="bg-warning-50 border-b border-warning-100 text-primary-900 px-4 py-2 text-sm flex items-center gap-2 no-print">
      <IconAlert className="w-4 h-4 text-warning" />
      <span>
        <strong>Prototipo dimostrativo</strong> — non destinato all'uso clinico reale. Calcoli e regole sono illustrativi e configurabili.
      </span>
    </div>
  );
}
