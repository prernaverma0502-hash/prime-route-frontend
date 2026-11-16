import { useRole } from '../context/RoleContext';
import { hasPermission, isApprovalRequired } from './permissions';

/**
 * Hook to verify if the active user role has permission to execute an action on a module.
 *
 * @param {string} module - Module identifier (e.g. 'vehicles', 'accounting', 'users')
 * @param {string} action - Action ('view' | 'add' | 'edit' | 'approve' | 'export' | 'archive' | 'administer')
 * @returns {{ can: boolean, requiresApproval: boolean, role: string, isOwner: boolean }}
 */
export function usePermission(module, action = 'view') {
  const { currentRoleId } = useRole();
  const role = (currentRoleId || 'owner').toLowerCase();

  const can = hasPermission(role, module, action);
  const requiresApproval = isApprovalRequired(role, module, action);
  const isOwner = role === 'owner';

  return {
    can,
    requiresApproval,
    role,
    isOwner,
  };
}

export default usePermission;

