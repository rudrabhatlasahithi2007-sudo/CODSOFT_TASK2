import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchProjectsApi, 
  fetchProjectByIdApi, 
  createProjectApi, 
  updateProjectApi, 
  deleteProjectApi 
} from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    priority: 'All'
  });

  const loadProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchProjectsApi(filters);
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user, filters]);

  const getProjectDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetchProjectByIdApi(id);
      setCurrentProject(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to load project details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const res = await createProjectApi(projectData);
      setProjects(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const updateProject = async (id, updateData) => {
    try {
      const res = await updateProjectApi(id, updateData);
      setProjects(prev => prev.map(p => p._id === id ? { ...p, ...res.data } : p));
      if (currentProject && currentProject._id === id) {
        setCurrentProject(prev => ({ ...prev, ...res.data }));
      }
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteProjectApi(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      if (currentProject && currentProject._id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loading,
      filters,
      setFilters,
      loadProjects,
      getProjectDetails,
      createProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
