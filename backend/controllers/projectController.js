import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../services/projectService.js';
import { getTasks } from '../services/taskService.js';

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await getProjects(req.query);
    const tasks = await getTasks();

    // Attach computed task metrics (e.g. progress percentage, completed tasks, total tasks)
    const projectsWithMetrics = projects.map(proj => {
      const projTasks = tasks.filter(t => String(t.projectId) === String(proj._id));
      const totalTasks = projTasks.length;
      const completedTasks = projTasks.filter(t => t.status === 'Completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...proj,
        totalTasks,
        completedTasks,
        progress
      };
    });

    res.json(projectsWithMetrics);
  } catch (error) {
    next(error);
  }
};

export const getSingleProject = async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await getTasks({ projectId: req.params.id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      ...project,
      tasks,
      totalTasks,
      completedTasks,
      progress
    });
  } catch (error) {
    next(error);
  }
};

export const createNewProject = async (req, res, next) => {
  try {
    const { title, startDate, dueDate } = req.body;
    if (!title || !startDate || !dueDate) {
      return res.status(400).json({ message: 'Please provide title, start date, and due date' });
    }

    const projectData = {
      ...req.body,
      ownerId: req.user._id,
      members: req.body.members && req.body.members.length > 0 ? req.body.members : [req.user._id]
    };

    const project = await createProject(projectData);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProjectDetails = async (req, res, next) => {
  try {
    const project = await updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProjectItem = async (req, res, next) => {
  try {
    const success = await deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
