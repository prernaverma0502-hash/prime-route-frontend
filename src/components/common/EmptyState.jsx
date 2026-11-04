import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#0A1E42]">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

