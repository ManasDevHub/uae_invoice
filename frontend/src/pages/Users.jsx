import { useState } from 'react'
import Card from '../components/ui/Card'
import Pill from '../components/ui/Pill'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import { UserPlus, Save, X } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@adamas.tech', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.m@adamas.tech', role: 'Analyst', status: 'Active' },
    { id: 3, name: 'John Doe', email: 'john.d@adamas.tech', role: 'Viewer', status: 'Pending' }
  ])

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const startEdit = (u) => {
    setEditingId(u.id)
    setEditForm({ ...u })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = () => {
    setUsers(users.map(u => u.id === editingId ? editForm : u))
    setEditingId(null)
    toast.success('User updated successfully')
  }

  const handleInvite = () => {
    const newUser = {
      id: Date.now(),
      name: 'New Assigned User',
      email: `user${users.length + 1}@adamas.tech`,
      role: 'Viewer',
      status: 'Pending'
    }
    setUsers([...users, newUser])
    toast.success('Invitation email sent!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2340]">User management</h1>
          <p className="text-sm text-[#5a6a85] mt-1">Manage team members and their roles</p>
        </div>
        <Button variant="primary" onClick={handleInvite} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite user
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8faff] text-[#5a6a85] border-b border-[#e3eaf7]">
              <tr>
                <th className="px-6 py-3 font-medium w-1/4">Name</th>
                <th className="px-6 py-3 font-medium w-1/4">Email</th>
                <th className="px-6 py-3 font-medium w-1/6">Role</th>
                <th className="px-6 py-3 font-medium w-1/6">Status</th>
                <th className="px-6 py-3 font-medium text-right w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3eaf7]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8faff]">
                  {editingId === user.id ? (
                    <>
                      <td className="px-6 py-3"><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-[#e3eaf7] rounded px-2 py-1 focus:outline-none focus:border-[#1a6fcf]" /></td>
                      <td className="px-6 py-3"><input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border border-[#e3eaf7] rounded px-2 py-1 focus:outline-none focus:border-[#1a6fcf]" /></td>
                      <td className="px-6 py-3">
                        <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="border border-[#e3eaf7] rounded px-2 py-1 focus:outline-none focus:border-[#1a6fcf]">
                          <option>Admin</option><option>Analyst</option><option>Viewer</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="border border-[#e3eaf7] rounded px-2 py-1 focus:outline-none focus:border-[#1a6fcf]">
                          <option>Active</option><option>Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={saveEdit} className="text-[#22c55e] hover:bg-[#dcfce7] p-1.5 rounded transition-colors"><Save className="w-4 h-4" /></button>
                          <button onClick={cancelEdit} className="text-[#e53e3e] hover:bg-[#fee2e2] p-1.5 rounded transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-[#1a2340]">{user.name}</td>
                      <td className="px-6 py-4 text-[#5a6a85]">{user.email}</td>
                      <td className="px-6 py-4">
                        <Pill variant={user.role === 'Admin' ? 'violet' : user.role === 'Analyst' ? 'blue' : 'gray'}>
                          {user.role}
                        </Pill>
                      </td>
                      <td className="px-6 py-4">
                        <Pill variant={user.status === 'Active' ? 'green' : 'warning'}>
                          {user.status}
                        </Pill>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => startEdit(user)} className="text-[#1a6fcf] hover:underline font-medium text-sm">Edit</button>
                        <button onClick={() => { setUsers(users.filter(u => u.id !== user.id)); toast('User removed', { icon: '🗑️' })}} className="ml-4 text-[#e53e3e] hover:underline font-medium text-sm">Remove</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
