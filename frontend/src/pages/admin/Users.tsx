import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import type { User } from '@/types';
import { Shield, Mail, Phone, Calendar, UserCheck, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await adminApi.getUsers({ page_size: 100 });
            setUsers(data.results);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id: string, newRole: 'ADMIN' | 'STAFF' | 'CUSTOMER') => {
        try {
            await adminApi.updateUser(id, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>User Management</h2>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>User</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Contact Info</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Joined Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Role</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                                {user.first_name[0]}{user.last_name[0]}
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{user.first_name} {user.last_name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: #{user.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text)', fontSize: '0.85rem' }}>
                                            <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {user.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text)', fontSize: '0.85rem', marginTop: 4 }}>
                                            <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {user.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Calendar size={14} />
                                            {new Date(user.date_joined).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Shield size={16} style={{ color: user.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                                style={{
                                                    fontSize: '0.85rem', fontWeight: 600, padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--color-border)', backgroundColor: '#fff', color: 'var(--color-text)',
                                                    outline: 'none', cursor: 'pointer'
                                                }}
                                            >
                                                <option value="CUSTOMER">CUSTOMER</option>
                                                <option value="STAFF">STAFF</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                                            {user.is_verified ? (
                                                <span title="Verified User" style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                                                    <UserCheck size={16} /> VERIFIED
                                                </span>
                                            ) : (
                                                <span title="Unverified User" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                                                    <UserMinus size={16} /> UNVERIFIED
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
