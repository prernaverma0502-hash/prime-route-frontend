import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/forms/FormInputs';

export default function UserManagementTab({
  users,
  onSaveUser,
  onDeleteUser,
}) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Fleet Manager',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Fleet Manager', status: 'Active' });
    setIsUserModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsUserModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUser(editingUser, newUser);
    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Fleet Manager', status: 'Active' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0A1E42]">User Management</h3>
          <p className="text-xs text-slate-500">Manage administrator and dispatch staff logins</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#075EE8] text-white text-xs font-bold rounded-xl hover:bg-[#0650C7] flex items-center gap-1.5 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50/20">
                <td className="py-3.5 px-4 font-bold text-[#0A1E42]">{u.name}</td>
                <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4 font-semibold text-[#075EE8]">{u.role}</td>
                <td className="py-3.5 px-4"><StatusBadge status={u.status} /></td>
                <td className="py-3.5 px-4 text-slate-400">{u.lastLogin}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 text-slate-400 hover:text-[#075EE8] rounded cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Add New System User'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. Sarah Connor"
            required
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="s.connor@primeroute.io"
            required
          />
          <FormSelect
            label="Assigned Business Role"
            name="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              'Administrator 1 (Owner)',
              'Administrator 2',
              'Finance Employee',
              'Fleet / Maintenance Employee',
              'Rental / Operations Employee',
              'Manager',
              'Read-Only User'
            ]}
          />
          <FormSelect
            label="Account Status"
            name="status"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow cursor-pointer"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

