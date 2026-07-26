import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, ShieldCheck, Users, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, register, handleDemoLogin, usersList, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
    department: 'Engineering'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegistering) {
        await register(formData.name, formData.email, formData.password, formData.role, formData.department);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 text-white font-extrabold text-xl">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TaskPulse</h1>
          <p className="text-xs text-slate-400">Enterprise Project Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          
          <div className="flex border-b border-slate-100 pb-3">
            <button
              onClick={() => setIsRegistering(false)}
              className={`flex-1 text-center py-2 text-xs font-extrabold transition-colors cursor-pointer ${
                !isRegistering ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-3.5' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className={`flex-1 text-center py-2 text-xs font-extrabold transition-colors cursor-pointer ${
                isRegistering ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-3.5' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="alex.morgan@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Lead Developer">Lead Developer</option>
                    <option value="Developer">Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {submitting ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-3">Instant Demo Sign In</p>
            <div className="grid grid-cols-2 gap-2">
              {usersList.slice(0, 4).map(u => (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => handleDemoLogin(u.email)}
                  className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-colors cursor-pointer"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{u.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-slate-400 truncate">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
