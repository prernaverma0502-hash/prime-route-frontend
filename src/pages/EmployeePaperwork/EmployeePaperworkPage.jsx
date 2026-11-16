import React, { useState } from 'react';
import {
  Save,
  Send,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import PaperworkStepper from './components/PaperworkStepper';
import AdminReviewBar from './components/AdminReviewBar';
import SectionPersonal from './components/SectionPersonal';
import SectionEmployment from './components/SectionEmployment';
import SectionDocuments from './components/SectionDocuments';
import SectionAgreements from './components/SectionAgreements';
import SubmissionSuccessModal from './components/SubmissionSuccessModal';
import AdminReviewModal from './components/AdminReviewModal';

export default function EmployeePaperworkPage() {
  const { currentRoleId, activeRole, paperworkData, updatePaperwork } = useRole();

  // Local editable form state initialized from role context
  const [formData, setFormData] = useState(() => ({
    personal: { ...paperworkData.personal },
    employment: { ...paperworkData.employment },
    documents: { ...paperworkData.documents },
    agreements: { ...paperworkData.agreements }
  }));

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitSuccessModalOpen, setIsSubmitSuccessModalOpen] = useState(false);
  const [reviewModalState, setReviewModalState] = useState({ isOpen: false, action: null }); // 'Approve' | 'Reject'
  const [adminNotes, setAdminNotes] = useState('');

  const status = paperworkData.status;

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Field change handlers
  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleEmploymentChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      employment: { ...prev.employment, [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleAgreementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      agreements: { ...prev.agreements, [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Mock document upload handler
  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File exceeds 10MB limit. Please choose a smaller file.', 'error');
      return;
    }

    const docObj = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      type: file.type || 'application/pdf'
    };

    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: docObj }
    }));

    if (errors[docKey]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[docKey];
        return copy;
      });
    }

    showToast(`Uploaded "${file.name}" successfully!`, 'success');
  };

  const handleRemoveDocument = (docKey) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: null }
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Personal validation
    if (!formData.personal.firstName?.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.personal.lastName?.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.personal.email?.trim() || !/\S+@\S+\.\S+/.test(formData.personal.email)) {
      newErrors.email = 'Valid Email Address is required';
    }
    if (!formData.personal.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.personal.dob?.trim()) newErrors.dob = 'Date of birth is required';
    if (!formData.personal.address?.trim()) newErrors.address = 'Street Address is required';
    if (!formData.personal.city?.trim()) newErrors.city = 'City is required';
    if (!formData.personal.state?.trim()) newErrors.state = 'State is required';
    if (!formData.personal.zipCode?.trim()) newErrors.zipCode = 'ZIP Code is required';
    if (!formData.personal.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.personal.emergencyContactPhone?.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    }

    // Employment validation
    if (!formData.employment.position?.trim()) newErrors.position = 'Job Position is required';
    if (!formData.employment.department?.trim()) newErrors.department = 'Department is required';
    if (!formData.employment.employmentType?.trim()) newErrors.employmentType = 'Employment Type is required';
    if (!formData.employment.joiningDate?.trim()) newErrors.joiningDate = 'Joining Date is required';
    if (!formData.employment.assignedManager?.trim()) newErrors.assignedManager = 'Assigned Manager is required';

    // Document validation (Gov ID and Driving License are strictly mandatory for fleet staff)
    if (!formData.documents.governmentId) newErrors.governmentId = 'Government ID document is required';
    if (!formData.documents.drivingLicense) newErrors.drivingLicense = 'Driving License is required';
    if (!formData.documents.taxDocuments) newErrors.taxDocuments = 'Tax Document (W-4 / W-9) is required';
    if (!formData.documents.bankDetails) newErrors.bankDetails = 'Direct Deposit / Bank Details document is required';

    // Agreements validation
    if (!formData.agreements.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the Employee Agreement and safety policies';
    }
    if (!formData.agreements.digitalSignature) {
      newErrors.digitalSignature = 'Please draw or type your signature and click "Adopt & Confirm"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actions
  const handleSaveDraft = () => {
    updatePaperwork({
      status: 'Draft',
      personal: formData.personal,
      employment: formData.employment,
      documents: formData.documents,
      agreements: formData.agreements,
      lastUpdated: new Date().toISOString()
    });
    showToast('Draft saved successfully! You can resume filling out this form at any time.', 'success');
  };

  const handleSubmitPaperwork = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please complete all mandatory fields, upload required documents, and sign the agreement.', 'error');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    const timestamp = new Date().toISOString();
    updatePaperwork({
      status: 'Pending Review',
      personal: formData.personal,
      employment: formData.employment,
      documents: formData.documents,
      agreements: formData.agreements,
      submittedAt: timestamp,
      lastUpdated: timestamp
    });

    setIsSubmitSuccessModalOpen(true);
  };

  // Admin / Manager Review test handlers
  const handleAdminApprove = () => {
    updatePaperwork({
      status: 'Approved',
      reviewNotes: adminNotes || 'All onboarding documents verified and accepted by compliance team.'
    });
    setReviewModalState({ isOpen: false, action: null });
    showToast('Paperwork approved successfully! Employee profile status updated to Active.', 'success');
  };

  const handleAdminReject = () => {
    updatePaperwork({
      status: 'Rejected',
      reviewNotes: adminNotes || 'Please re-upload a clearer copy of your Driving License with expiration date clearly legible.'
    });
    setReviewModalState({ isOpen: false, action: null });
    showToast('Paperwork rejected with feedback notes. Employee notified to resubmit.', 'error');
  };

  const handleAdminReset = () => {
    updatePaperwork({
      status: 'Draft',
      reviewNotes: ''
    });
    showToast('Paperwork status reset to Draft for testing.', 'success');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold transition-all animate-slide-up ${
          toastMessage.type === 'error'
            ? 'bg-rose-600 text-white border-rose-700'
            : 'bg-[#0A1E42] text-white border-slate-800'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Employees & Staff</span>
            <span>/</span>
            <span className="text-[#075EE8] font-semibold">Onboarding Documentation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1E42] tracking-tight mt-1">
            Employee Paperwork & Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your personal profile, tax compliance, driver credential uploads, and sign company fleet policies.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A1E42] border border-slate-200 font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handleSubmitPaperwork}
            className="px-5 py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Submit Paperwork
          </button>
        </div>
      </div>

      {/* Top Paperwork Status Lifecycle Indicator */}
      <PaperworkStepper
        status={status}
        submissionId={paperworkData.submissionId}
        submittedAt={paperworkData.submittedAt}
        reviewNotes={paperworkData.reviewNotes}
      />

      {/* Admin / Manager Review Simulation Bar */}
      {currentRoleId !== 'readonly_manager' && (
        <AdminReviewBar
          activeRoleName={activeRole.name}
          onApprove={() => {
            setReviewModalState({ isOpen: true, action: 'Approve' });
            setAdminNotes('All documentation verified. Driver cleared for fleet operations.');
          }}
          onReject={() => {
            setReviewModalState({ isOpen: true, action: 'Reject' });
            setAdminNotes('Please provide a clearer copy of your Driving License with full expiration date visible.');
          }}
          onReset={handleAdminReset}
        />
      )}

      {/* Main Multi-Section Form */}
      <form onSubmit={handleSubmitPaperwork} className="space-y-6">
        <SectionPersonal
          formData={formData}
          errors={errors}
          onPersonalChange={handlePersonalChange}
        />

        <SectionEmployment
          formData={formData}
          errors={errors}
          onEmploymentChange={handleEmploymentChange}
        />

        <SectionDocuments
          formData={formData}
          errors={errors}
          onFileUpload={handleFileUpload}
          onRemoveDocument={handleRemoveDocument}
        />

        <SectionAgreements
          formData={formData}
          errors={errors}
          onAgreementChange={handleAgreementChange}
        />

        {/* Bottom Submission Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>By clicking submit, your onboarding paperwork will be routed to compliance for verification.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit Paperwork
            </button>
          </div>
        </div>
      </form>

      {/* Submission Success Confirmation Modal */}
      <SubmissionSuccessModal
        isOpen={isSubmitSuccessModalOpen}
        onClose={() => setIsSubmitSuccessModalOpen(false)}
        paperworkData={paperworkData}
        formData={formData}
      />

      {/* Admin Review Action Modal */}
      <AdminReviewModal
        isOpen={reviewModalState.isOpen}
        action={reviewModalState.action}
        adminNotes={adminNotes}
        onAdminNotesChange={setAdminNotes}
        onClose={() => setReviewModalState({ isOpen: false, action: null })}
        onConfirmApprove={handleAdminApprove}
        onConfirmReject={handleAdminReject}
      />
    </div>
  );
}
