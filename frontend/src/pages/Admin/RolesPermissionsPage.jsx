import React, { useState, useEffect } from 'react'
import api from '../../api'

const defaultRoles = [
    {
        id: 1, name: 'Super Admin', color: 'red', icon: '🛡️', description: 'Full system access with all permissions',
        users: 1, builtIn: true,
        permissions: {
            dashboard: ['view', 'export'],
            content: ['view', 'create', 'edit', 'delete', 'approve', 'reject'],
            ai: ['view_logs', 'flag', 'configure', 'review'],
            users: ['view', 'create', 'edit', 'suspend', 'delete'],
            scholars: ['view', 'add', 'assign', 'remove'],
            moderation: ['view', 'action', 'dismiss'],
            analytics: ['view', 'export'],
            audit: ['view', 'export'],
            settings: ['view', 'edit'],
        }
    },
    {
        id: 2, name: 'Scholar', color: 'amber', icon: '👳', description: 'Review and validate AI-generated Islamic content',
        users: 4, builtIn: true,
        permissions: {
            dashboard: ['view'],
            content: ['view', 'create', 'edit', 'approve', 'reject'],
            ai: ['view_logs', 'flag', 'review'],
            users: ['view'],
            scholars: ['view'],
            moderation: ['view', 'action'],
            analytics: ['view'],
            audit: ['view'],
            settings: ['view'],
        }
    },
    {
        id: 3, name: 'Content Manager', color: 'blue', icon: '📝', description: 'Manage and publish Islamic content',
        users: 3, builtIn: false,
        permissions: {
            dashboard: ['view'],
            content: ['view', 'create', 'edit', 'delete'],
            ai: ['view_logs'],
            users: ['view'],
            scholars: [],
            moderation: ['view'],
            analytics: ['view'],
            audit: [],
            settings: [],
        }
    },
    {
        id: 4, name: 'Moderator', color: 'green', icon: '🛡️', description: 'Handle community moderation and reports',
        users: 2, builtIn: false,
        permissions: {
            dashboard: ['view'],
            content: ['view'],
            ai: ['view_logs', 'flag'],
            users: ['view', 'suspend'],
            scholars: [],
            moderation: ['view', 'action', 'dismiss'],
            analytics: [],
            audit: ['view'],
            settings: [],
        }
    },
]

const permissionCategories = {
    dashboard: { label: 'Dashboard', icon: '📊', actions: ['view', 'export'] },
    content: { label: 'Content', icon: '📝', actions: ['view', 'create', 'edit', 'delete', 'approve', 'reject'] },
    ai: { label: 'AI System', icon: '🧠', actions: ['view_logs', 'flag', 'configure', 'review'] },
    users: { label: 'Users', icon: '👥', actions: ['view', 'create', 'edit', 'suspend', 'delete'] },
    scholars: { label: 'Scholars', icon: '👳', actions: ['view', 'add', 'assign', 'remove'] },
    moderation: { label: 'Moderation', icon: '🛡️', actions: ['view', 'action', 'dismiss'] },
    analytics: { label: 'Analytics', icon: '📈', actions: ['view', 'export'] },
    audit: { label: 'Audit Logs', icon: '📋', actions: ['view', 'export'] },
    settings: { label: 'Settings', icon: '⚙️', actions: ['view', 'edit'] },
}

const roleColors = {
    red: 'from-red-500 to-rose-600',
    amber: 'from-amber-500 to-orange-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    pink: 'from-pink-500 to-rose-600',
}

export default function RolesPermissionsPage() {
    const [roles, setRoles] = useState(defaultRoles)
    const [selectedRole, setSelectedRole] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [newRole, setNewRole] = useState({ name: '', description: '', color: 'purple', icon: '🔑' })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        api.get('/auth/admin/roles/')
            .then(res => { if (res.data?.length) setRoles(res.data) })
            .catch(() => { })
    }, [])

    const togglePermission = (category, action) => {
        if (!selectedRole || !editMode) return
        setRoles(prev => prev.map(role => {
            if (role.id !== selectedRole.id) return role
            const perms = { ...role.permissions }
            if (perms[category]?.includes(action)) {
                perms[category] = perms[category].filter(a => a !== action)
            } else {
                perms[category] = [...(perms[category] || []), action]
            }
            return { ...role, permissions: perms }
        }))
        setSelectedRole(prev => {
            if (!prev) return prev
            const perms = { ...prev.permissions }
            if (perms[category]?.includes(action)) {
                perms[category] = perms[category].filter(a => a !== action)
            } else {
                perms[category] = [...(perms[category] || []), action]
            }
            return { ...prev, permissions: perms }
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put(`/auth/admin/roles/${selectedRole.id}/permissions/`, selectedRole.permissions)
        } catch { /* local state only */ }
        setSaving(false)
        setSaved(true)
        setEditMode(false)
        setTimeout(() => setSaved(false), 3000)
    }

    const handleAddRole = () => {
        const role = {
            id: Math.max(...roles.map(r => r.id)) + 1,
            ...newRole,
            users: 0,
            builtIn: false,
            permissions: Object.fromEntries(Object.keys(permissionCategories).map(k => [k, []])),
        }
        setRoles(prev => [...prev, role])
        setShowAddModal(false)
        setNewRole({ name: '', description: '', color: 'purple', icon: '🔑' })
        setSelectedRole(role)
        setEditMode(true)
    }

    const deleteRole = (roleId) => {
        const role = roles.find(r => r.id === roleId)
        if (role?.builtIn) return
        setRoles(prev => prev.filter(r => r.id !== roleId))
        if (selectedRole?.id === roleId) setSelectedRole(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">🔐</span>
                        Access Control
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Define roles and manage granular permissions for admin panel access
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 hover:translate-y-[-1px] transition-all duration-300"
                >
                    + Create Role
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Roles List */}
                <div className="col-span-4 space-y-3">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => { setSelectedRole(role); setEditMode(false) }}
                            className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${selectedRole?.id === role.id
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-lg shadow-brand-500/10'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[role.color]} flex items-center justify-center text-lg shadow-md`}>
                                    {role.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{role.name}</span>
                                        {role.builtIn && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">BUILT-IN</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{role.description}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{role.users}</div>
                                    <div className="text-[10px] text-slate-400 uppercase">users</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Permissions Matrix */}
                <div className="col-span-8">
                    {selectedRole ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[selectedRole.color]} flex items-center justify-center text-lg shadow-md`}>
                                        {selectedRole.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedRole.name} Permissions</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedRole.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {editMode ? (
                                        <>
                                            <button
                                                onClick={() => setEditMode(false)}
                                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-5 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-lg hover:bg-green-600 transition-colors"
                                            >
                                                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium hover:bg-brand-100 transition-colors"
                                            >
                                                Edit Permissions
                                            </button>
                                            {!selectedRole.builtIn && (
                                                <button
                                                    onClick={() => deleteRole(selectedRole.id)}
                                                    className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 transition-colors"
                                                >
                                                    Delete Role
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {Object.entries(permissionCategories).map(([key, category]) => (
                                    <div key={key} className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">{category.icon}</span>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{category.label}</span>
                                            <span className="text-xs text-slate-400 ml-auto">
                                                {selectedRole.permissions[key]?.length || 0}/{category.actions.length}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {category.actions.map(action => {
                                                const isEnabled = selectedRole.permissions[key]?.includes(action)
                                                return (
                                                    <button
                                                        key={action}
                                                        onClick={() => togglePermission(key, action)}
                                                        disabled={!editMode}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isEnabled
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shadow-sm'
                                                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                                            } ${editMode ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                                                    >
                                                        {isEnabled ? '✓ ' : ''}{action.replace('_', ' ')}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                            <div className="text-5xl mb-4">🔐</div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select a Role</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Click on a role to view and manage its permissions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Role Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Role</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role Name</label>
                                <input
                                    type="text"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                    placeholder="e.g. Content Reviewer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <input
                                    type="text"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                    placeholder="Brief description of this role..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
                                <div className="flex gap-2">
                                    {Object.keys(roleColors).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewRole(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[color]} transition-all ${newRole.color === color ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                            <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRole}
                                disabled={!newRole.name}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg hover:shadow-brand-500/40 disabled:opacity-50 transition-all"
                            >
                                Create Role
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
