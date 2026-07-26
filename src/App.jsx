import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { TaskProvider, useTask } from './context/TaskContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreateProjectModal from './components/CreateProjectModal';
import CreateTaskModal from './components/CreateTaskModal';
import TaskModal from './components/TaskModal';

import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';

function MainLayout() {
  const { user, loading: authLoading } = useAuth();
  const { projects } = useProject();
  const { tasks } = useTask();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('To Do');
  const [searchQuery, setSearchQuery] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
        Initializing TaskPulse Workspace...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleOpenCreateTask = (status = 'To Do') => {
    setDefaultTaskStatus(status);
    setShowCreateTaskModal(true);
  };

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
    setActiveTab('project-details');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 antialiased font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'project-details') setSelectedProjectId(null);
          setActiveTab(tab);
        }}
        projectCount={projects.length}
        taskCount={tasks.length}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar
          onOpenCreateProject={() => setShowCreateProjectModal(true)}
          onOpenCreateTask={() => handleOpenCreateTask('To Do')}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setActiveTab}
              onOpenCreateProject={() => setShowCreateProjectModal(true)}
              onOpenCreateTask={() => handleOpenCreateTask('To Do')}
              onSelectProject={handleSelectProject}
              onSelectTask={setSelectedTask}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              onOpenCreateProject={() => setShowCreateProjectModal(true)}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'project-details' && (
            <ProjectDetailsPage
              projectId={selectedProjectId}
              onBack={() => setActiveTab('projects')}
              onOpenCreateTask={(st) => handleOpenCreateTask(st)}
              onSelectTask={setSelectedTask}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              onOpenCreateTask={(st) => handleOpenCreateTask(st)}
              onSelectTask={setSelectedTask}
            />
          )}

          {activeTab === 'team' && <TeamPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* Modals */}
      {showCreateProjectModal && (
        <CreateProjectModal onClose={() => setShowCreateProjectModal(false)} />
      )}

      {showCreateTaskModal && (
        <CreateTaskModal
          defaultStatus={defaultTaskStatus}
          onClose={() => setShowCreateTaskModal(false)}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <MainLayout />
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
