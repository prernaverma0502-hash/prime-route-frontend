import React from 'react';
import { usePermission } from './usePermission';
import { ShieldAlert } from 'lucide-react';

/**
 * <Can module="accounting" do="add" fallback={null}>
 *   <button>Create Invoice</button>
 * </Can>
 */
export default function Can({
  module,
  do: action = 'view',
  children,
  fallback = null,
  showApprovalNotice = false,
}) {
  const { can, requiresApproval, role } = usePermission(module, action);

  if (requiresApproval && showApprovalNotice) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
        <span>Owner Approval Required</span>
      </div>
    );
  }

  if (!can) {
    return fallback;
  }

  return <>{children}</>;
}

