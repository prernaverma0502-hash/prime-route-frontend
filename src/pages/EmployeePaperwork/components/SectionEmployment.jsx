import React from 'react';
import { Briefcase } from 'lucide-react';

export default function SectionEmployment({ formData, errors, onEmploymentChange }) {
  return (
    <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1E42]">
              Section B: Employment Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Position assignment, department, work authorization type, and reporting manager.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Employee ID */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Employee Identification ID
          </label>
          <input
            type="text"
            readOnly
            value={formData.employment.employeeId}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 font-mono font-bold text-slate-700 cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 mt-1">Permanent PrimeRoute personnel ID</p>
        </div>

        {/* Job Position */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Job Position <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.employment.position}
            onChange={(e) => onEmploymentChange('position', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.position ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          >
            <option value="Logistics Fleet Driver">Logistics Fleet Driver</option>
            <option value="Commercial CDL Driver">Commercial CDL Driver</option>
            <option value="Fleet Maintenance Specialist">Fleet Maintenance Specialist</option>
            <option value="Depot Dispatcher">Depot Dispatcher</option>
            <option value="Operations Assistant">Operations Assistant</option>
          </select>
          {errors.position && <p className="text-[11px] text-rose-500 mt-1">{errors.position}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.employment.department}
            onChange={(e) => onEmploymentChange('department', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.department ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          >
            <option value="Fleet Operations">Fleet Operations</option>
            <option value="Maintenance & Service">Maintenance & Service</option>
            <option value="Logistics & Dispatch">Logistics & Dispatch</option>
            <option value="Safety & Compliance">Safety & Compliance</option>
            <option value="Administration">Administration</option>
          </select>
          {errors.department && <p className="text-[11px] text-rose-500 mt-1">{errors.department}</p>}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Employment Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.employment.employmentType}
            onChange={(e) => onEmploymentChange('employmentType', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.employmentType ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          >
            <option value="Full-Time">Full-Time (W-2)</option>
            <option value="Part-Time">Part-Time (W-2)</option>
            <option value="Independent Contractor">Independent Contractor (1099)</option>
            <option value="Seasonal / Temporary">Seasonal / Temporary</option>
          </select>
          {errors.employmentType && <p className="text-[11px] text-rose-500 mt-1">{errors.employmentType}</p>}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Joining Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.employment.joiningDate}
            onChange={(e) => onEmploymentChange('joiningDate', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.joiningDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          />
          {errors.joiningDate && <p className="text-[11px] text-rose-500 mt-1">{errors.joiningDate}</p>}
        </div>

        {/* Assigned Manager */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Assigned Manager / Supervisor <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.employment.assignedManager}
            onChange={(e) => onEmploymentChange('assignedManager', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
              errors.assignedManager ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#075EE8]'
            } focus:outline-hidden`}
          >
            <option value="Marcus Vance">Marcus Vance (Fleet Operations Lead)</option>
            <option value="Sarah Jenkins">Sarah Jenkins (Safety & Compliance)</option>
            <option value="John Doe">John Doe (Managing Director)</option>
          </select>
          {errors.assignedManager && <p className="text-[11px] text-rose-500 mt-1">{errors.assignedManager}</p>}
        </div>
      </div>
    </section>
  );
}

