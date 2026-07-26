import Project from '../models/Project.js';
import { initialProjects } from '../utils/seedData.js';

let projectsStore = [...initialProjects];

export const getProjects = async (query = {}) => {
  const { search, category, status, priority } = query;

  try {
    if (process.env.MONGODB_URI) {
      let filter = {};
      if (category && category !== 'All') filter.category = category;
      if (status && status !== 'All') filter.status = status;
      if (priority && priority !== 'All') filter.priority = priority;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const projects = await Project.find(filter).sort({ updatedAt: -1 });
      if (projects && projects.length > 0) return projects;
    }
  } catch (err) {
    console.warn('Projects DB query fallback:', err.message);
  }

  let result = [...projectsStore];

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }
  if (status && status !== 'All') {
    result = result.filter(p => p.status === status);
  }
  if (priority && priority !== 'All') {
    result = result.filter(p => p.priority === priority);
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  return result;
};

export const getProjectById = async (id) => {
  try {
    if (process.env.MONGODB_URI) {
      const p = await Project.findById(id);
      if (p) return p;
    }
  } catch (err) {
    // fallback
  }
  return projectsStore.find(p => p._id === id) || null;
};

export const createProject = async (projectData) => {
  try {
    if (process.env.MONGODB_URI) {
      const newProj = await Project.create(projectData);
      return newProj;
    }
  } catch (err) {
    console.warn('Mongoose create project fallback:', err.message);
  }

  const newProject = {
    _id: `proj_${Date.now()}`,
    title: projectData.title,
    description: projectData.description || '',
    category: projectData.category || 'General',
    status: projectData.status || 'Planning',
    priority: projectData.priority || 'Medium',
    startDate: projectData.startDate || new Date().toISOString().split('T')[0],
    dueDate: projectData.dueDate || new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
    budget: Number(projectData.budget) || 0,
    ownerId: projectData.ownerId,
    members: projectData.members || [projectData.ownerId],
    tags: projectData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projectsStore.unshift(newProject);
  return newProject;
};

export const updateProject = async (id, updateData) => {
  try {
    if (process.env.MONGODB_URI) {
      const updated = await Project.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
      if (updated) return updated;
    }
  } catch (err) {
    // fallback
  }

  const index = projectsStore.findIndex(p => p._id === id);
  if (index !== -1) {
    projectsStore[index] = { 
      ...projectsStore[index], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    return projectsStore[index];
  }
  return null;
};

export const deleteProject = async (id) => {
  try {
    if (process.env.MONGODB_URI) {
      await Project.findByIdAndDelete(id);
    }
  } catch (err) {
    // fallback
  }
  projectsStore = projectsStore.filter(p => p._id !== id);
  return true;
};
