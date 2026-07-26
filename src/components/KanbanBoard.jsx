import React from 'react';
import TaskCard from './TaskCard';
import { Plus, CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';

export default function KanbanBoard({ tasks, onTaskClick, onStatusChange, onOpenCreateTask }) {
  const columns = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-500/10 text-slate-700 border-slate-300' },
    { id: 'To Do', label: 'To Do', color: 'bg-blue-500/10 text-blue-700 border-blue-300' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-amber-500/10 text-amber-700 border-amber-300' },
    { id: 'Review', label: 'In Review', color: 'bg-purple-500/10 text-purple-700 border-purple-300' },
    { id: 'Completed', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);

        return (
          <div key={col.id} className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col min-w-[250px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-bold text-slate-500">{colTasks.length}</span>
              </div>

              <button
                onClick={() => onOpenCreateTask && onOpenCreateTask(col.id)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                title={`Add task to ${col.label}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {colTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={onTaskClick}
                  onStatusChange={onStatusChange}
                />
              ))}

              {colTasks.length === 0 && (
                <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">
                  No tasks in {col.label}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
