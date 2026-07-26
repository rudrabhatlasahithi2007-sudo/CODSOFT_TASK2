import { getAllUsers, findUserById, updateUser } from '../services/userService.js';
import { getTasks } from '../services/taskService.js';
import { getProjects } from '../services/projectService.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const tasks = await getTasks();
    const projects = await getProjects();

    // Attach workload statistics to each user
    const usersWithStats = users.map(user => {
      const userTasks = tasks.filter(t => t.assigneeId === user._id);
      const activeTasks = userTasks.filter(t => t.status !== 'Completed').length;
      const completedTasks = userTasks.filter(t => t.status === 'Completed').length;
      const userProjects = projects.filter(p => p.members && p.members.includes(user._id)).length;

      return {
        ...user,
        activeTasksCount: activeTasks,
        completedTasksCount: completedTasks,
        projectsCount: userProjects
      };
    });

    res.json(usersWithStats);
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await getTasks({ assigneeId: user._id });
    const projects = await getProjects();
    const userProjects = projects.filter(p => p.members && p.members.includes(user._id));

    res.json({
      user,
      assignedTasks: tasks,
      projects: userProjects
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
