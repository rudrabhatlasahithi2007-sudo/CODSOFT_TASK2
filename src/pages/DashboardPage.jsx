import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage({ onNavigate, onOpenCreateProject, onOpenCreateTask, onSelectProject, onSelectTask }) {
  const { projects } = useProject();
  const { tasks, updateTaskStatus } = useTask();
  const { user } = useAuth();

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active');
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date());

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-lg mb-3 border border-indigo-500/30">
            Welcome back, {user?.name || 'Developer'} 👋
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Workspace Overview & Project Health
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            You have <span className="font-bold text-white">{activeProjects.length} active projects</span> and{' '}
            <span className="font-bold text-amber-300">{inProgressTasks.length} tasks in progress</span>. Target completion rate is tracking at {completionRate}%.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateProject}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
            <button
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Task Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value={activeProjects.length}
          icon={FolderKanban}
          color="indigo"
          change={`${completedProjectsCount} Completed`}
          changeType="positive"
        />
        <StatsCard
          title="Tasks Completed"
          value={`${completedTasks}/${totalTasks}`}
          icon={CheckSquare}
          color="emerald"
          change={`${completionRate}% Done`}
          changeType="positive"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks.length}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon={AlertCircle}
          color="rose"
          change={overdueTasks.length > 0 ? 'Needs Attention' : 'All Clear'}
          changeType={overdueTasks.length > 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Active Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Projects</h3>
            <p className="text-xs text-slate-500">Projects currently in active execution</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeProjects.slice(0, 3).map(proj => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onClick={onSelectProject}
            />
          ))}

          {activeProjects.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
              No active projects found. Click "Create New Project" to get started!
            </div>
          )}
        </div>
      </div>

      {/* Upcoming & Priority Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">High Priority & In-Progress Tasks</h3>
            <p className="text-xs text-slate-500">Tasks requiring immediate attention or review</p>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Task Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgressTasks.slice(0, 3).map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={onSelectTask}
              onStatusChange={updateTaskStatus}
            />
          ))}

          {inProgressTasks.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
              No in-progress tasks right now!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
