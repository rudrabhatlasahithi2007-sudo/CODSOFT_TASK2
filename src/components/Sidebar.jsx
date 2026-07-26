import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Sparkles,
  Layers,
  ChevronRight,
  Target
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, projectCount = 0, taskCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projectCount },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare, badge: taskCount },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            TaskPulse <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 font-semibold rounded-md border border-indigo-500/30">PRO</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Project Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 space-y-1.5">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Banner */}
      <div className="p-3.5 m-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[11px] font-bold text-slate-200">Express + Node Engine</p>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Full REST API active with MongoDB & local persistence support.
        </p>
      </div>
    </aside>
  );
}
