import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Plus,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { ROLES_CONFIG, hasPermission } from '../../auth/permissions';
import Modal from '../../components/common/Modal';
import { FormInput, FormSelect } from '../../components/forms/FormInputs';
import StatusBadge from '../../components/common/StatusBadge';
import NoAccessPage from '../../components/common/NoAccessPage';
import { usersApi, loadStoredUsers, persistUsers } from '../../api/users';

export default function UsersAndRolesPage({ onNavigateHome, onOpenRoleSwitcher }) {
  const { currentRoleId } = useRole();
  const isOwner = currentRoleId === 'owner';

  const [users, setUsers] = useState(() => {
    return loadStoredUsers();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Invite modal form state
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'rental_operations',
    department: 'Fleet Operations',
  });

  const saveUsers = (updated) => {
    setUsers(updated);
    persistUsers(updated);
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Guard: Owner Only
  if (!isOwner) {
    return (
      <NoAccessPage
        moduleName="Users and Roles Administration"
        onNavigateHome={onNavigateHome}
        onOpenRoleSwitcher={onOpenRoleSwitcher}
      />
    );
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.department || '').toLowerCase().includes(q);

      const userRole = (u.role || '').toLowerCase();
      const filterRole = roleFilter.toLowerCase();
      const matchesRole =
        roleFilter === 'All' ||
        u.role === roleFilter ||
        userRole === filterRole ||
        (filterRole === 'secondary_admin' && (userRole === 'admin' || userRole === 'administrator'));

      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleToggleStatus = (userId) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        // Prevent deactivating own root owner account
        if (u.role === 'owner' && u.id === 'USR-001') {
          showToast('Cannot deactivate primary system owner account.', 'error');
          return u;
        }
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`User ${u.name} set to ${newStatus}.`, 'success');
        return { ...u, status: newStatus };
      }
      return u;
    });
    saveUsers(updated);
  };

  const handleRoleChange = (userId, newRole) => {
    let chosenRole = newRole;
    const lowerRole = String(newRole).toLowerCase().trim();
    if (lowerRole === 'admin' || lowerRole === 'administrator') {
      chosenRole = 'secondary_admin';
    }
    const updated = users.map((u) => {
      if (u.id === userId) {
        if (u.id === 'USR-001' && chosenRole !== 'owner') {
          showToast('Primary owner role cannot be changed.', 'error');
          return u;
        }
        showToast(`Updated ${u.name}'s role to ${ROLES_CONFIG[chosenRole]?.name || chosenRole}.`, 'success');
        return { ...u, role: chosenRole };
      }
      return u;
    });
    saveUsers(updated);
    try {
      usersApi.updateUser(userId, { role: chosenRole }).catch(console.error);
    } catch {
      // ignore
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      showToast('Please provide both name and email.', 'error');
      return;
    }

    // Determine chosen role and normalize admin values if needed
    let chosenRole = inviteForm.role || 'secondary_admin';
    const lower = String(chosenRole).toLowerCase().trim();
    if (lower === 'admin' || lower === 'administrator' || lower === 'administrator 2' || lower === 'secondary admin') {
      chosenRole = 'secondary_admin';
    } else if (lower === 'owner' || lower === 'administrator 1' || lower === 'primary admin') {
      chosenRole = 'owner';
    }

    // Unique ID generation ensuring no collisions
    const existingIds = users.map((u) => u.id).filter(Boolean);
    let nextNum = users.length + 1;
    while (existingIds.includes(`USR-${String(nextNum).padStart(3, '0')}`)) {
      nextNum++;
    }

    const newUser = {
      id: `USR-${String(nextNum).padStart(3, '0')}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      password: 'password123',
      role: chosenRole,
      department: inviteForm.department || 'Executive Administration',
      status: 'Active',
      lastLogin: 'Never (Invited)',
      avatar: '/placeholders/avatar-default.svg',
    };

    const updated = [newUser, ...users];
    saveUsers(updated);
    try {
      usersApi.createUser(newUser).catch(console.error);
    } catch {
      // ignore
    }

    setIsInviteModalOpen(false);
    setInviteForm({
      name: '',
      email: '',
      role: 'rental_operations',
      department: 'Fleet Operations',
    });
    showToast(`Invitation sent to ${newUser.email}! Account is ready for login.`, 'success');
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;

  return (
    <div className="space-y-6 animate-slide-up duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold animate-slide-up ${
          toastMessage.type === 'error'
            ? 'bg-rose-600 text-white border-rose-700'
            : 'bg-[#0A1E42] text-white border-slate-800'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-200" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-[#0A1E42] tracking-tight">
              Users &amp; Roles Management
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              Owner Restricted Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign business roles, manage user activation status, and invite team members to PrimeRoute.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#075EE8] hover:bg-[#0650C7] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Invite New User
        </button>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Accounts</span>
          <p className="text-2xl font-black text-[#0A1E42] mt-1">{users.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Registered personnel</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Users</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Cleared for access</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">System Roles</span>
          <p className="text-2xl font-black text-[#075EE8] mt-1">6</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Granular RBAC profiles</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Primary Owner</span>
          <p className="text-2xl font-black text-purple-700 mt-1">1</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Master administrator</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name, email, department..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Roles</option>
              {Object.values(ROLES_CONFIG).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Assigned Role (6 RBAC)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const roleKey = (user.role === 'admin' || user.role === 'Administrator') ? 'secondary_admin' : user.role;
                const roleConfig = ROLES_CONFIG[roleKey] || ROLES_CONFIG.secondary_admin;
                const isActive = user.status === 'Active';

                return (
                  <tr key={user.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || '/placeholders/avatar-default.svg'}
                          alt={user.name}
                          onError={(e) => { e.currentTarget.src = '/placeholders/avatar-default.svg'; }}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0A1E42]">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {user.department}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={roleKey}
                        disabled={user.id === 'USR-001'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer focus:outline-hidden ${roleConfig.badgeColor}`}
                      >
                        {Object.values(ROLES_CONFIG).map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {user.lastLogin}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New User"
        subtitle="Provision a new team member and assign their initial RBAC role"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            value={inviteForm.name}
            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            placeholder="e.g. Jessica Taylor"
            required
          />

          <FormInput
            label="Email Address (Corporate Login)"
            name="email"
            type="email"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            placeholder="jessica.taylor@primeroute.io"
            required
          />

          <FormSelect
            label="Assigned Business Role (6 RBAC Roles)"
            name="role"
            value={inviteForm.role}
            onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
            options={Object.values(ROLES_CONFIG).map((r) => ({
              value: r.id,
              label: `${r.name} (${r.badge})`,
            }))}
          />

          <FormSelect
            label="Assigned Department"
            name="department"
            value={inviteForm.department}
            onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
            options={[
              'Fleet Operations',
              'Finance & Accounting',
              'Logistics & Dispatch',
              'Maintenance & Service',
              'Compliance Oversight',
              'Executive Administration',
            ]}
          />

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            <strong className="block mb-0.5">Role Capability Notice:</strong>
            {ROLES_CONFIG[inviteForm.role]?.description}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#075EE8] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

