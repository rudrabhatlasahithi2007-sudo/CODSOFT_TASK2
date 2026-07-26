import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  LayoutGrid, 
  List 
} from 'lucide-react';

export default function ProjectsPage({ onOpenCreateProject, onSelectProject }) {
  const { projects, filters, setFilters, deleteProject } = useProject();
  const [activeTab, setActiveTab] = useState('All');

  const statusTabs = ['All', 'Active', 'Planning', 'On Hold', 'Completed'];

  const filteredProjects = projects.filter(p => {
    if (activeTab !== 'All' && p.status !== activeTab) return false;
    if (filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      return p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Projects Directory</h2>
          <p className="text-xs text-slate-500 font-medium">Manage and track all organizational projects</p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category & Search Filter */}
        <div className="flex items-center gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Finance & Payments">Finance & Payments</option>
            <option value="Security">Security</option>
            <option value="Marketing">Marketing</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden w-48"
            />
          </div>
        </div>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={onSelectProject}
            onDelete={deleteProject}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No projects found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
