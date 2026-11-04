import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect, FileUpload, FormTextarea } from '../../components/forms/FormInputs';

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vehicle Documents',
    relatedTo: 'Toyota Camry SE (PR-2024-TC)',
    uploadDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-08-01',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    status: 'Valid'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `DOC-${Math.floor(Math.random() * 900 + 100)}`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Fleet Compliance Document"
      subtitle="Store official registration, insurance policies, permits, or commercial licenses"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Document Title / Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Commercial Automobile Policy Certificate"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Document Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              'Vehicle Documents',
              'Driver Documents',
              'Insurance Documents',
              'Registration Documents',
              'Rental Agreements',
              'Licenses',
              'Other Documents'
            ]}
          />

          <FormInput
            label="Related Vehicle / Driver / Entity"
            name="relatedTo"
            value={formData.relatedTo}
            onChange={handleChange}
            placeholder="e.g. Toyota Camry (PR-2024-TC) or Sarah Jenkins"
            required
          />

          <FormInput
            label="Upload Date"
            name="uploadDate"
            type="date"
            value={formData.uploadDate}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Expiration Date (If Applicable)"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>

        <FileUpload label="Select Document File (PDF, DOCX, PNG, JPG)" />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#075EE8] hover:bg-[#0650C7] text-sm font-semibold text-white shadow-md transition-all"
          >
            Upload Document
          </button>
        </div>
      </form>
    </Modal>
  );
}

