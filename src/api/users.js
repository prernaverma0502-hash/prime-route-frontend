import { delay, ApiError } from './client.js';

export const STORAGE_KEY_USERS = 'prime_route_users';
export const STORAGE_KEY_USERS_RBAC = 'primeroute_users_rbac';

export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Marcus Brody',
    email: 'marcus.brody@primeroute.io',
    password: 'password123',
    role: 'owner',
    department: 'Executive Administration',
    status: 'Active',
    lastLogin: 'Today, 10:42 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-002',
    name: 'Elena Vance',
    email: 'elena.vance@primeroute.io',
    password: 'password123',
    role: 'secondary_admin',
    department: 'Fleet Operations',
    status: 'Active',
    lastLogin: 'Today, 09:15 AM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-003',
    name: 'Michael Chang',
    email: 'michael.chang@primeroute.io',
    password: 'password123',
    role: 'finance',
    department: 'Finance & Accounting',
    status: 'Active',
    lastLogin: 'Yesterday, 04:30 PM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-004',
    name: 'Tom Gallagher',
    email: 'tom.gallagher@primeroute.io',
    password: 'password123',
    role: 'fleet_maintenance',
    department: 'Maintenance & Service',
    status: 'Active',
    lastLogin: 'Yesterday, 02:10 PM',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-005',
    name: 'Sarah Connor',
    email: 'sarah.connor@primeroute.io',
    password: 'password123',
    role: 'rental_operations',
    department: 'Logistics & Dispatch',
    status: 'Active',
    lastLogin: 'Jul 10, 2025 11:45 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-006',
    name: 'Rachel Green',
    email: 'rachel.green@primeroute.io',
    password: 'password123',
    role: 'readonly_manager',
    department: 'Compliance Oversight',
    status: 'Active',
    lastLogin: 'Jul 08, 2025 09:00 AM',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-007',
    name: 'David Miller',
    email: 'david.miller@primeroute.io',
    password: 'password123',
    role: 'fleet_maintenance',
    department: 'Fleet Operations',
    status: 'Inactive',
    lastLogin: 'Jun 28, 2025 03:20 PM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
];

export const loadStoredUsers = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw =
        window.localStorage.getItem(STORAGE_KEY_USERS) ||
        window.localStorage.getItem(STORAGE_KEY_USERS_RBAC);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
  }
  return [...INITIAL_USERS];
};

export const persistUsers = (usersList) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const serialized = JSON.stringify(usersList);
      window.localStorage.setItem(STORAGE_KEY_USERS, serialized);
      window.localStorage.setItem(STORAGE_KEY_USERS_RBAC, serialized);
    }
  } catch (err) {
    console.error('Failed to write users to localStorage:', err);
  }
};

export const usersApi = {
  async getUsers() {
    await delay();
    return loadStoredUsers();
  },

  async createUser(userData) {
    await delay();
    const current = loadStoredUsers();

    // Generate unique ID
    const existingIds = current.map((u) => u.id).filter(Boolean);
    let nextNum = current.length + 1;
    while (existingIds.includes(`USR-${String(nextNum).padStart(3, '0')}`)) {
      nextNum++;
    }

    const newUser = {
      id: userData.id || `USR-${String(nextNum).padStart(3, '0')}`,
      lastLogin: 'Never (Invited)',
      status: 'Active',
      avatar: '/placeholders/avatar-default.svg',
      ...userData,
    };

    const updated = [newUser, ...current];
    persistUsers(updated);
    return { ...newUser };
  },

  async updateUser(idOrEmail, updates) {
    await delay();
    const current = loadStoredUsers();
    const index = current.findIndex(
      (u) => u.email === idOrEmail || u.id === idOrEmail || u.name === idOrEmail
    );
    if (index === -1) throw new ApiError(`User "${idOrEmail}" not found`, 404);

    current[index] = { ...current[index], ...updates };
    persistUsers([...current]);
    return { ...current[index] };
  },

  async deleteUser(id) {
    await delay();
    const current = loadStoredUsers();
    const filtered = current.filter((u) => u.id !== id);
    persistUsers(filtered);
    return { success: true };
  },
};

export default usersApi;
