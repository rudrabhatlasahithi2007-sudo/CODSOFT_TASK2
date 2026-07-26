import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit3,
  Users,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({ project, onClick, onEdit, onDelete }) {
  const { usersList } = useAuth();

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On Hold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Resolve member avatars
  const memberObjs = (project.members || []).map(id => 
    usersList.find(u => u._id === id) || { _id: id, name: 'User', avatar: '' }
  );

  return (
    <div 
      onClick={() => onClick && onClick(project._id)}
      className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${getPriorityBadge(project.priority)}`}>
              {project.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                title="Edit project"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
            <span className="text-slate-500">Progress</span>
            <span className="text-slate-900">{project.progress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                (project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Footer info: Members & Due Date */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {memberObjs.slice(0, 4).map((m, idx) => (
              <img
                key={m._id || idx}
                src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={m.name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                title={m.name}
              />
            ))}
            {memberObjs.length > 4 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 ring-2 ring-white">
                +{memberObjs.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Due {project.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
