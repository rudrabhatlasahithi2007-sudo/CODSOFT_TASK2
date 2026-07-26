import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskCard from '../components/TaskCard';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';

export default function ProjectDetailsPage({ projectId, onBack, onOpenCreateTask, onSelectTask }) {
  const { getProjectDetails, currentProject, loading } = useProject();
  const { tasks, updateTaskStatus } = useTask();
  const { usersList } = useAuth();
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' or 'list'

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId);
    }
  }, [projectId]);

  if (loading || !currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium text-xs">
        Loading project details...
      </div>
    );
  }

  const projectTasks = tasks.filter(t => String(t.projectId) === String(currentProject._id));
  const memberObjs = (currentProject.members || []).map(id => 
    usersList.find(u => u._id === id) || { _id: id, name: 'Team Member', role: 'Contributor', avatar: '' }
  );

  const total = projectTasks.length;
  const completed = projectTasks.filter(t => t.status === 'Completed').length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      {/* Project Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200/60">
                {currentProject.category}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                {currentProject.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              {currentProject.title}
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {currentProject.description}
            </p>
          </div>

          <button
            onClick={() => onOpenCreateTask && onOpenCreateTask('To Do')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start lg:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task to Project</span>
          </button>
        </div>

        {/* Info Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Start Date</span>
            <span className="font-bold text-slate-800">{currentProject.startDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Target Deadline</span>
            <span className="font-bold text-slate-800">{currentProject.dueDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Budget</span>
            <span className="font-bold text-slate-800">${Number(currentProject.budget || 0).toLocaleString()} USD</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Progress Metric</span>
            <span className="font-bold text-emerald-600">{progressPercent}% Completed ({completed}/{total})</span>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Team Members</h4>
          <div className="flex flex-wrap items-center gap-2">
            {memberObjs.map(m => (
              <div key={m._id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-700">
                <img src={m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{m.name}</span>
                <span className="text-[10px] text-slate-400">({m.role})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Section & View Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Project Tasks</h3>
            <p className="text-xs text-slate-500">Manage deliverables and move items through workflow stages</p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeView === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeView === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {activeView === 'kanban' ? (
          <KanbanBoard
            tasks={projectTasks}
            onTaskClick={onSelectTask}
            onStatusChange={updateTaskStatus}
            onOpenCreateTask={onOpenCreateTask}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectTasks.map(t => (
              <TaskCard
                key={t._id}
                task={t}
                onClick={onSelectTask}
                onStatusChange={updateTaskStatus}
              />
            ))}
            {projectTasks.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No tasks created for this project yet.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
