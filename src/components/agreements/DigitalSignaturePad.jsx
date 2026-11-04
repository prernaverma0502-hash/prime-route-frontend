import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, RotateCcw, Check, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DigitalSignaturePad({
  title,
  signerName,
  role = 'Driver',
  initialSignature = null,
  onSignatureChange,
  readOnly = false
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!initialSignature);
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' | 'type'
  const [typedName, setTypedName] = useState(signerName || '');
  const [isSaved, setIsSaved] = useState(!!initialSignature);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#071D49';
    ctx.lineWidth = 2.5;

    // Load initial signature if provided
    if (initialSignature && typeof initialSignature === 'string' && initialSignature.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
        setIsSaved(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (readOnly || isSaved) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || readOnly || isSaved) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    setIsSaved(false);
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (signatureMode === 'type') {
      // Render typed cursive signature to canvas
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = 'italic 34px "Brush Script MT", "Segoe Script", "Great Vibes", cursive, sans-serif';
      ctx.fillStyle = '#071D49';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName || signerName, rect.width / 2, rect.height / 2);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setIsSaved(true);
    if (onSignatureChange) {
      onSignatureChange(dataUrl);
    }
  };

  const handleResetForEdit = () => {
    setIsSaved(false);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <h4 className="text-xs font-bold text-[#0A1E42] flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-[#075EE8]" /> {title}
          </h4>
          <p className="text-[11px] text-slate-500">
            Signatory: <strong className="text-slate-800">{signerName || 'Authorized Signer'}</strong> ({role})
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {isSaved ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Signature Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Signature Required
            </span>
          )}
        </div>
      </div>

      {/* Mode Switcher (if not readOnly and not yet confirmed) */}
      {!readOnly && !isSaved && (
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setSignatureMode('draw');
              handleClear();
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              signatureMode === 'draw'
                ? 'bg-[#075EE8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Draw by Hand
          </button>
          <button
            type="button"
            onClick={() => {
              setSignatureMode('type');
              setHasDrawn(true);
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              signatureMode === 'type'
                ? 'bg-[#075EE8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Type to Sign
          </button>
        </div>
      )}

      {/* Signature Canvas Area */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full h-28 sm:h-32 rounded-xl border-2 transition-all select-none touch-none bg-slate-50/50 ${
            isSaved
              ? 'border-emerald-300 bg-emerald-50/20 cursor-default'
              : signatureMode === 'draw'
              ? 'border-dashed border-slate-300 hover:border-blue-400 cursor-crosshair'
              : 'border-slate-300 bg-white'
          }`}
        />

        {/* Baseline Guide */}
        <div className="absolute left-6 right-6 bottom-6 border-b border-dashed border-slate-300 pointer-events-none flex items-center justify-between text-[10px] text-slate-400">
          <span>x Signature Line</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>

        {/* Typed Input Overlay if in Type Mode */}
        {!isSaved && signatureMode === 'type' && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/90 rounded-xl">
            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value);
                setHasDrawn(e.target.value.trim().length > 0);
              }}
              placeholder="Type your legal name to sign..."
              className="w-full text-center text-2xl font-serif italic text-[#071D49] border-b-2 border-[#075EE8] pb-1 focus:outline-none bg-transparent"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="flex items-center justify-between pt-1 text-xs">
          {!isSaved ? (
            <>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>

              <button
                type="button"
                disabled={!hasDrawn && !(signatureMode === 'type' && typedName.trim().length > 0)}
                onClick={handleConfirm}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold transition-all shadow-sm ${
                  hasDrawn || (signatureMode === 'type' && typedName.trim().length > 0)
                    ? 'bg-[#075EE8] text-white hover:bg-[#0650C7] cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" /> Adopt &amp; Confirm
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-medium">
                Digitally sealed and bound to legal agreement record.
              </span>
              <button
                type="button"
                onClick={handleResetForEdit}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Re-sign / Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

