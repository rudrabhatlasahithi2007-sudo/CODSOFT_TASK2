import React from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  CheckSquare, 
  MoreVertical,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TaskCard({ task, onClick, onStatusChange }) {
  const { usersList } = useAuth();

  const assignee = usersList.find(u => u._id === task.assigneeId) || {
    name: 'Unassigned',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

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

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <div 
      onClick={() => onClick && onClick(task)}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer space-y-3"
    >
      {/* Top Header Tags */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getPriorityBadge(task.priority)}`}>
          {task.priority}
        </span>

        {/* Quick status dropdown */}
        {onStatusChange && (
          <select
            value={task.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-hidden"
          >
            <option value="Backlog">Backlog</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[9px] font-semibold rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>{completedSubtasks}/{totalSubtasks} Checklist</span>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>

          {(task.comments || []).length > 0 && (
            <div className="flex items-center gap-1 text-slate-500 font-semibold">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span>{task.comments.length}</span>
            </div>
          )}

          {(task.attachments || []).length > 0 && (
            <div className="flex items-center gap-1 text-slate-500 font-semibold">
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        <img
          src={assignee.avatar}
          alt={assignee.name}
          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
          title={`Assigned to ${assignee.name}`}
        />
      </div>
    </div>
  );
}
