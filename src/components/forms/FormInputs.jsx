import React from 'react';

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  min,
  max,
  step
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
            : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
        } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'text-[#0A1E42]'}`}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  disabled = false,
  className = '',
  placeholder = 'Select option...'
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl appearance-none transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
          } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'text-[#0A1E42]'}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
          error
            ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
            : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
        } text-[#0A1E42]`}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}

export function FileUpload({
  label,
  helper = 'PNG, JPG, PDF up to 10MB',
  onFileSelect,
  className = ''
}) {
  const [fileName, setFileName] = React.useState('');

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-[#075EE8] rounded-xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all">
        <input type="file" className="hidden" onChange={handleChange} />
        <span className="text-xs font-medium text-[#075EE8]">
          {fileName ? `Selected: ${fileName}` : 'Click to browse or drop file here'}
        </span>
        <span className="text-[11px] text-slate-400 mt-1">{helper}</span>
      </label>
    </div>
  );
}

