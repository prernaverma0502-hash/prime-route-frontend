import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Full-Screen Backdrop covering entire viewport including sidebar */}
      <div
        className="fixed inset-0 bg-[#071D49]/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Centering Wrapper ensures modal is fully visible and vertically centered */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 md:p-6 text-center">
        {/* Modal Dialog Card */}
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-[90vh] z-10 animate-scale-up duration-250`}
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1E42] tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all duration-200 active:scale-90 group cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Scrollable Content body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
