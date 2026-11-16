import React from 'react';
import { Upload, Check, FileText, Trash2 } from 'lucide-react';

export default function SectionDocuments({ formData, errors, onFileUpload, onRemoveDocument }) {
  return (
    <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1E42]">
              Section C: Compliance Document Upload
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload scanned PDF copies or clear color photographs (PNG, JPG) up to 10MB per file.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Government ID */}
        <div className={`p-4 rounded-2xl border transition-all ${
          errors.governmentId ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0A1E42]">
                1. Government ID <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Passport, State ID, or Military ID</p>
            </div>
            {formData.documents.governmentId ? (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
            )}
          </div>

          {formData.documents.governmentId ? (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.documents.governmentId.name}</p>
                  <p className="text-[10px] text-slate-400">{formData.documents.governmentId.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument('governmentId')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">Choose File</span>
              <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFileUpload('governmentId', e)}
                className="hidden"
              />
            </label>
          )}
          {errors.governmentId && <p className="text-[11px] text-rose-500 mt-1.5">{errors.governmentId}</p>}
        </div>

        {/* 2. Driving License */}
        <div className={`p-4 rounded-2xl border transition-all ${
          errors.drivingLicense ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0A1E42]">
                2. Driving License <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Valid Commercial or Class D License</p>
            </div>
            {formData.documents.drivingLicense ? (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
            )}
          </div>

          {formData.documents.drivingLicense ? (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.documents.drivingLicense.name}</p>
                  <p className="text-[10px] text-slate-400">{formData.documents.drivingLicense.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument('drivingLicense')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">Choose File</span>
              <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFileUpload('drivingLicense', e)}
                className="hidden"
              />
            </label>
          )}
          {errors.drivingLicense && <p className="text-[11px] text-rose-500 mt-1.5">{errors.drivingLicense}</p>}
        </div>

        {/* 3. Tax Documents */}
        <div className={`p-4 rounded-2xl border transition-all ${
          errors.taxDocuments ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0A1E42]">
                3. Tax Form (W-4 / W-9) <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Signed Federal Withholding / Taxpayer ID</p>
            </div>
            {formData.documents.taxDocuments ? (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
            )}
          </div>

          {formData.documents.taxDocuments ? (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.documents.taxDocuments.name}</p>
                  <p className="text-[10px] text-slate-400">{formData.documents.taxDocuments.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument('taxDocuments')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">Choose File</span>
              <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFileUpload('taxDocuments', e)}
                className="hidden"
              />
            </label>
          )}
          {errors.taxDocuments && <p className="text-[11px] text-rose-500 mt-1.5">{errors.taxDocuments}</p>}
        </div>

        {/* 4. Bank Details */}
        <div className={`p-4 rounded-2xl border transition-all ${
          errors.bankDetails ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0A1E42]">
                4. Direct Deposit / Bank Details <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Voided Check or Bank Letter</p>
            </div>
            {formData.documents.bankDetails ? (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase">Required</span>
            )}
          </div>

          {formData.documents.bankDetails ? (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.documents.bankDetails.name}</p>
                  <p className="text-[10px] text-slate-400">{formData.documents.bankDetails.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument('bankDetails')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">Choose File</span>
              <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFileUpload('bankDetails', e)}
                className="hidden"
              />
            </label>
          )}
          {errors.bankDetails && <p className="text-[11px] text-rose-500 mt-1.5">{errors.bankDetails}</p>}
        </div>

        {/* 5. Other Documents (Optional) */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 md:col-span-2 lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-[#0A1E42]">
                5. Other Required Documents <span className="text-slate-400 font-normal">(Optional / Medical Card)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">DOT Medical Certificate, Forklift/Hazmat certifications, or defensive driving credentials</p>
            </div>
            {formData.documents.otherDocuments && (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {formData.documents.otherDocuments ? (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{formData.documents.otherDocuments.name}</p>
                  <p className="text-[10px] text-slate-400">{formData.documents.otherDocuments.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument('otherDocuments')}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="mt-3 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">Choose File (Optional)</span>
              <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFileUpload('otherDocuments', e)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}

