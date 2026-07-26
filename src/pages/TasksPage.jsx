import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskCard from '../components/TaskCard';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List 
} from 'lucide-react';

export default function TasksPage({ onOpenCreateTask, onSelectTask }) {
  const { tasks, updateTaskStatus, taskFilters, setTaskFilters } = useTask();
  const { projects } = useProject();
  const { usersList } = useAuth();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid'

  const filteredTasks = tasks.filter(t => {
    if (taskFilters.projectId && String(t.projectId) !== String(taskFilters.projectId)) return false;
    if (taskFilters.assigneeId && String(t.assigneeId) !== String(taskFilters.assigneeId)) return false;
    if (taskFilters.priority !== 'All' && t.priority !== taskFilters.priority) return false;
    if (taskFilters.status !== 'All' && t.status !== taskFilters.status) return false;
    if (taskFilters.search) {
      const s = taskFilters.search.toLowerCase();
      return t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Task Board & Workflow</h2>
          <p className="text-xs text-slate-500 font-medium">Track work items across Kanban status pipelines</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={() => onOpenCreateTask && onOpenCreateTask('To Do')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Project Filter */}
        <select
          value={taskFilters.projectId}
          onChange={(e) => setTaskFilters({ ...taskFilters, projectId: e.target.value })}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          value={taskFilters.assigneeId}
          onChange={(e) => setTaskFilters({ ...taskFilters, assigneeId: e.target.value })}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden"
        >
          <option value="">All Assignees</option>
          {usersList.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={taskFilters.priority}
          onChange={(e) => setTaskFilters({ ...taskFilters, priority: e.target.value })}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Search */}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskFilters.search}
            onChange={(e) => setTaskFilters({ ...taskFilters, search: e.target.value })}
            className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden w-44"
          />
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={onSelectTask}
          onStatusChange={updateTaskStatus}
          onOpenCreateTask={onOpenCreateTask}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(t => (
            <TaskCard
              key={t._id}
              task={t}
              onClick={onSelectTask}
              onStatusChange={updateTaskStatus}
            />
          ))}

          {filteredTasks.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
              No tasks match the active filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
