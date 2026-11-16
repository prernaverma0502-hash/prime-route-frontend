import React from 'react';
import { Clock, Save, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function PaperworkStepper({ status, submissionId, submittedAt, reviewNotes }) {
  const steps = [
    { id: 'Not Started', label: 'Not Started', icon: Clock, color: 'text-slate-400 bg-slate-100 border-slate-200' },
    { id: 'Draft', label: 'Draft', icon: Save, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'Pending Review', label: 'Pending Review', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'Approved', label: 'Approved', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'Rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' }
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Compliance &amp; Onboarding Lifecycle</span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-lg font-bold text-[#0A1E42]">Paperwork Status:</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
              status === 'Approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : status === 'Pending Review'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : status === 'Rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : status === 'Draft'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {status}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 font-mono">
          Ref ID: <strong>{submissionId}</strong>
          {submittedAt && (
            <span className="block text-[11px] text-slate-400 font-sans mt-0.5">
              Submitted on: {new Date(submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
        {steps.map((st) => {
          const Icon = st.icon;
          const isCurrent = status === st.id;
          return (
            <div
              key={st.id}
              className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                isCurrent
                  ? `${st.color} font-bold shadow-xs scale-102 ring-2 ring-current/20`
                  : 'bg-slate-50/60 border-slate-100 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] leading-tight">{st.label}</span>
            </div>
          );
        })}
      </div>

      {reviewNotes && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
          status === 'Approved'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
            : status === 'Rejected'
            ? 'bg-rose-50/80 border-rose-200 text-rose-800'
            : 'bg-blue-50/80 border-blue-200 text-blue-800'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Reviewer Feedback:</strong>
            <p className="mt-0.5 leading-relaxed">{reviewNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

